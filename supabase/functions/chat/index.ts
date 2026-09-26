// Supabase Edge Function: /functions/v1/chat
//
// Flow: embed the user's message with Gemini -> retrieve the closest
// booth activities + schedule events via pgvector (match_booth_activities /
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

// NOTE: these are the model names confirmed available to this project's key
// as of 2026-09-17 (via GET /v1beta/models). Google renames/retires Gemini
// models fairly often — if you get a 404 again, re-run that same request
// and check supportedGenerationMethods for "embedContent" / "generateContent".
const EMBEDDING_MODEL = 'gemini-embedding-001'
const CHAT_MODEL = 'gemini-3.6-flash'

const SYSTEM_INSTRUCTION = `أنت المساعد الذكي لزوّار "احتفالية العلوم 2026" في مكتبة الإسكندرية.
مهمتك مساعدة الزوار على إيجاد الأكشاك والفعاليات وفهم محتواها.
أجب بالعربية دائمًا، بإيجاز ووضوح.
استخدم فقط المعلومات الموجودة في "السياق" أدناه. إن لم تجد إجابة كافية في السياق، قل بصراحة إنك لا تملك هذه المعلومة، واقترح على الزائر السؤال في مكتب الاستقبال أو الدعم الفني عند الكشك رقم 1.
لا تختلق أرقام أكشاك أو أسماء مؤسسات غير موجودة في السياق.`

interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

// Arabic-Indic digit -> Western digit, so "٢٥" and "25" both work.
const ARABIC_INDIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'
function normalizeDigits(text: string): string {
  return text.replace(/[٠-٩]/g, (d) => String(ARABIC_INDIC_DIGITS.indexOf(d)))
}

// Vector similarity matches on MEANING, not on digits — a query like
// "كشك 5 عن ايه" embeds as roughly "what's this booth about", which has no
// strong semantic pull toward booth 5's specific description text. So an
// explicit "كشك <number>" / "booth <number>" reference is pulled out with
// a regex and looked up directly, rather than relying on the embedding to
// happen to work for exact-number lookups.
function extractBoothNumber(message: string): number | null {
  const normalized = normalizeDigits(message)
  const match = normalized.match(/(?:كشك|بوث|booth|stand)\D{0,6}(\d{1,3})|رقم\D{0,3}(\d{1,3})\D{0,6}كشك/i)
  if (!match) return null
  const num = match[1] ?? match[2]
  return num ? parseInt(num, 10) : null
}

async function fetchBoothExact(supabase: any, boothNumber: number) {
  const { data, error } = await supabase.from('booth_details').select('*').eq('booth_number', boothNumber)
  if (error) {
    console.warn(`Direct booth lookup for ${boothNumber} failed:`, error.message)
    return []
  }
  // booth_details rows already carry zone_name_ar/institution_ar/etc.
  // matching what buildContext() and the sources mapping expect; similarity
  // is set to 1 to mark these as exact, not approximate, matches.
  return (data ?? []).map((row: any) => ({ ...row, similarity: 1 }))
}

async function fetchEventInfo(supabase: any) {
  // event_info is tiny (event name + target audience) and fixed -- not a
  // fit for vector search (no embedding column, nothing to rank), so it's
  // just fetched in full and always included, independent of what the
  // visitor asked. This is what answers general "what is this event?"
  // questions that no single booth_activities row could ever match.
  const { data, error } = await supabase.from('event_info').select('*')
  if (error) {
    console.warn('event_info fetch failed:', error.message)
    return []
  }
  return data ?? []
}

const EVENT_INFO_LABELS: Record<string, string> = {
  event_name: 'اسم الفعالية',
  target_audience: 'الجمهور المستهدف',
}

function buildContext(eventInfo: any[], activities: any[], events: any[]) {
  const eventInfoLines = (eventInfo ?? []).map(
    (e) => `- ${EVENT_INFO_LABELS[e.info_key] ?? e.info_key}: ${e.value_ar ?? ''}`
  )

  const activityLines = (activities ?? []).map((a) => {
    const dates = a.activity_dates ? `بتاريخ ${a.activity_dates}` : 'طوال أيام الفعالية'
    const type = a.activity_type_ar ? `[${a.activity_type_ar}، ${dates}]` : `[${dates}]`
    return `- كشك رقم ${a.booth_number ?? 'غير مرقم'} (${a.zone_name_ar ?? ''}) — ${a.institution_ar ?? ''}: ${
      a.description_ar ?? ''
    } ${type}`
  })

  const eventLines = (events ?? []).map(
    (e) =>
      `- فعالية عامة: ${e.activity_name} في ${e.location ?? ''} يوم ${e.event_date} الساعة ${
        e.start_time ?? ''
      }. ${e.description ?? ''}`
  )

  return [...eventInfoLines, ...activityLines, ...eventLines].join('\n') || 'لا يوجد سياق مطابق.'
}

// Carries the real HTTP status so callers can tell a transient failure
// (503 model-overloaded, 429 rate-limited) apart from a real one (400 bad
// request, 401 bad key) without re-parsing response text.
class GeminiRequestError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

// Gemini models occasionally return 503 "high demand" / 429 rate-limit —
// both are transient, so retry a couple of times with backoff before
// giving up. Anything else (bad key, malformed request) fails immediately
// since retrying won't help.
async function withRetry<T>(fn: () => Promise<T>, retries = 2, baseDelayMs = 600): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn()
    } catch (err) {
      const retryable = err instanceof GeminiRequestError && (err.status === 503 || err.status === 429)
      if (!retryable || attempt >= retries) throw err
      const delay = baseDelayMs * 2 ** attempt + Math.random() * 200
      console.warn(`Gemini ${err.status} (attempt ${attempt + 1}/${retries + 1}), retrying in ${Math.round(delay)}ms`)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}

async function embed(text: string): Promise<number[]> {
  return withRetry(() => embedOnce(text))
}

async function embedOnce(text: string): Promise<number[]> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // gemini-embedding-001 defaults to 3072 dims but supports truncating
      // to 768/1536/3072 via outputDimensionality — 768 matches the
      // vector(768) columns already set up in Postgres.
      body: JSON.stringify({
        content: { parts: [{ text }] },
        outputDimensionality: 768,
      }),
    }
  )
  if (!res.ok) throw new GeminiRequestError(res.status, `Embedding request failed: ${await res.text()}`)
  const data = await res.json()
  return data.embedding.values
}

async function generate(history: ChatMessage[], context: string, question: string): Promise<string> {
  return withRetry(() => generateOnce(history, context, question))
}

async function generateOnce(history: ChatMessage[], context: string, question: string): Promise<string> {
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
  if (!res.ok) throw new GeminiRequestError(res.status, `Generation request failed: ${await res.text()}`)
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

    const explicitBoothNumber = extractBoothNumber(message)
    const [exactMatches, queryEmbedding, eventInfo] = await Promise.all([
      explicitBoothNumber !== null ? fetchBoothExact(supabase, explicitBoothNumber) : Promise.resolve([]),
      embed(message),
      fetchEventInfo(supabase),
    ])

    const { data: vectorMatches, error: activityError } = await supabase.rpc('match_booth_activities', {
      query_embedding: queryEmbedding,
      match_count: 5,
    })
    if (activityError) throw activityError

    // Exact booth-number matches go first; fill remaining slots with the
    // semantic matches, skipping any activity_id already covered above.
    const exactIds = new Set(exactMatches.map((m: any) => m.activity_id))
    const activityMatches = [...exactMatches, ...(vectorMatches ?? []).filter((m: any) => !exactIds.has(m.activity_id))]

    // schedule_events / match_schedule_events don't exist in the database
    // yet (no Lecture Hall / Outdoor Stage content has been loaded). Treat
    // that as "no schedule matches" instead of failing the whole request,
    // so booth Q&A keeps working either way.
    let eventMatches: any[] = []
    const { data: eventData, error: eventError } = await supabase.rpc('match_schedule_events', {
      query_embedding: queryEmbedding,
      match_count: 3,
    })
    if (eventError) {
      console.warn('match_schedule_events unavailable (table may not exist yet):', eventError.message)
    } else {
      eventMatches = eventData ?? []
    }

    const context = buildContext(eventInfo, activityMatches ?? [], eventMatches)
    const answer = await generate(history as ChatMessage[], context, message)

    return new Response(
      JSON.stringify({
        answer,
        sources: (activityMatches ?? []).map((a: any) => ({
          boothNumber: a.booth_number,
          institutionName: a.institution_ar,
          similarity: a.similarity,
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
