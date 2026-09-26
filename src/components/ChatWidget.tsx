import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

interface Message {
  role: 'user' | 'model'
  text: string
}

const WELCOME_MESSAGE: Message = {
  role: 'model',
  text: 'أهلًا بك في احتفالية العلوم 2026! اسألني عن أي كشك أو فعالية وسأساعدك في إيجادها.',
}

// Shown to visitors on any failure — never the raw error text (e.g. "Edge
// Function returned a non-2xx status code"), which is meaningless to them
// and looks broken. The real error still goes to console.error for you.
const FRIENDLY_ERROR = 'عذرًا، حدث خطأ أثناء الاتصال بالمساعد الذكي. حاول مرة أخرى بعد قليل، أو اسأل في الكشك رقم 1.'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, open])

  async function sendMessage() {
    const question = input.trim()
    if (!question || loading) return

    const history = messages.filter((m) => m !== WELCOME_MESSAGE)
    setMessages((prev) => [...prev, { role: 'user', text: question }])
    setInput('')
    setLoading(true)

    try {
      const { data, error: fnError } = await supabase.functions.invoke('chat', {
        body: { message: question, history },
      })

      if (fnError) throw fnError
      if (data?.error) throw new Error(data.error)

      setMessages((prev) => [...prev, { role: 'model', text: data.answer }])
    } catch (err) {
      // Log the real error for debugging, but never show raw technical text
      // (a status code, a stack trace, a Postgres message) to visitors —
      // it renders as a normal chat reply instead of a scary red banner.
      console.error('Chat widget error:', err)
      setMessages((prev) => [...prev, { role: 'model', text: FRIENDLY_ERROR }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-5 end-5 z-50 flex flex-col items-end">
      {open && (
        <div className="mb-3 w-[min(92vw,380px)] h-[min(70vh,520px)] rounded-2xl border border-hairline bg-space-900 shadow-2xl flex flex-col overflow-hidden">
          <div className="px-4 py-3 border-b border-hairline flex items-center justify-between bg-surface">
            <span className="font-semibold text-sm">المساعد الذكي</span>
            <button
              onClick={() => setOpen(false)}
              className="text-ink-dim hover:text-ink text-lg leading-none"
              aria-label="إغلاق"
            >
              ×
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-comet text-space-950 ms-auto rounded-ee-sm'
                    : 'bg-surface text-ink rounded-es-sm'
                }`}
              >
                {m.text}
              </div>
            ))}
            {loading && (
              <div className="bg-surface text-ink-dim rounded-2xl rounded-es-sm px-3 py-2 text-sm w-fit">
                يكتب الآن...
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              sendMessage()
            }}
            className="p-3 border-t border-hairline flex gap-2 bg-surface"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اسأل عن كشك أو فعالية..."
              className="flex-1 bg-space-900 border border-hairline rounded-full px-4 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-comet"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-full bg-star text-space-950 font-semibold px-4 py-2 text-sm disabled:opacity-40"
            >
              إرسال
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-star text-space-950 shadow-xl flex items-center justify-center text-2xl hover:brightness-95 transition"
        aria-label="فتح المساعد الذكي"
      >
        {open ? '×' : '💬'}
      </button>
    </div>
  )
}
