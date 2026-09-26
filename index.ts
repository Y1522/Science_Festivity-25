// Supabase Edge Function: /functions/v1/chat
//
// Flow: embed the user's message with Gemini -> retrieve the closest
// booth sessions + schedule events via pgvector (match_sessions /
// match_schedule_events) -> ask Gemini to answer using only that
// context -> return the answer plus the sources used.
//
// Secrets required (set with `supabase secrets set`):
//   GEMINI_API_KEY
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided automatically
// by the Supabase Edge Functions runtime — no need to set them yourself.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// NOTE: these are the model names available at the time this was written.
// Google renames/retires Gemini models fairly often — if you get a 404,
// check https://ai.google.dev/gemini-api/docs/models for current names.
const EMBEDDING_MODEL = 'text-embedding-004'
const CHAT_MODEL = 'gemini-2.0-flash'

const SYSTEM_INSTRUCTION = `أنت المساعد الذكي لزوّار "احتفالية العلوم 2026" في مكتبة الإسكندرية.
مهمتك مساعدة الزوار على إيجاد الأكشاك والفعاليات وفهم محتواها.
أجب بالعربية دائمًا، بإيجاز ووضوح.
استخدم فقط المعلومات الموجودة في "السياق" أدناه. إن لم تجد إجابة كافية في السياق، قل بصراحة إنك لا تملك هذه المعلومة، واقترح على الزائر السؤال في مكتب الاستقبال أو الدعم الفني عند الكشك رقم 1.
لا تختلق أرقام أكشاك أو أسماء مؤسسات غير موجودة في السياق.`

interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

function buildContext(sessions: any[], events: any[]) {
  const sessionLines = (sessions ?? []).map((s) => {
    const date = s.session_date ? `بتاريخ ${s.session_date}` : 'طوال أيام الفعالية'
    const duration = s.duration_minutes ? `، مدتها ${s.duration_minutes} دقيقة` : ''
    const age = s.age_label ? `، للفئة العمرية: ${s.age_label}` : ''
    return `- كشك رقم ${s.booth_number ?? 'غير مرقم'} (${s.tent_name ?? ''}) — ${s.institution_name}: "${
      s.title ?? ''
    }" ${s.description} [${s.activity_type}, ${date}${duration}${age}]`
  })

  const eventLines = (events ?? []).map(
    (e) =>
      `- فعالية عامة: ${e.activity_name} في ${e.location ?? ''} يوم ${e.event_date} الساعة ${
        e.start_time ?? ''
      }. ${e.description ?? ''}`
  )

  return [...sessionLines, ...eventLines].join('\n') || 'لا يوجد سياق مطابق.'
}

async function embed(text: string): Promise<number[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: { parts: [{ text }] } }),
    }
  )
  if (!res.ok) throw new Error(`Embedding request failed: ${await res.text()}`)
  const data = await res.json()
  return data.embedding.values
}

async function generate(history: ChatMessage[], context: string, question: string): Promise<string> {
  const contents = [
    ...history.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
    {
      role: 'user',
      parts: [{ text: `السياق:\n${context}\n\nسؤال الزائر: ${question}` }],
    },
  ]

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${CHAT_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents,
      }),
    }
  )
  if (!res.ok) throw new Error(`Generation request failed: ${await res.text()}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'عذرًا، لم أتمكن من إيجاد إجابة مناسبة.'
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, history = [] } = await req.json()

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing "message" string in request body.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    const queryEmbedding = await embed(message)

    const [{ data: sessionMatches, error: sessionError }, { data: eventMatches, error: eventError }] =
      await Promise.all([
        supabase.rpc('match_sessions', { query_embedding: queryEmbedding, match_count: 5 }),
        supabase.rpc('match_schedule_events', { query_embedding: queryEmbedding, match_count: 3 }),
      ])

    if (sessionError) throw sessionError
    if (eventError) throw eventError

    const context = buildContext(sessionMatches ?? [], eventMatches ?? [])
    const answer = await generate(history as ChatMessage[], context, message)

    return new Response(
      JSON.stringify({
        answer,
        sources: (sessionMatches ?? []).map((s: any) => ({
          boothNumber: s.booth_number,
          institutionName: s.institution_name,
          similarity: s.similarity,
        })),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error(err)
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
