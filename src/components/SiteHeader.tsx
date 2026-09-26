import { Link } from 'react-router-dom'
import { useLang } from '../lib/langContext'

export type NavKey = 'home' | 'about' | 'events' | 'today' | 'map'

export function Sparkle({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
      <path d="M12 1.5c.6 5.6 4.9 9.9 10.5 10.5-5.6.6-9.9 4.9-10.5 10.5C11.4 16.9 7.1 12.6 1.5 12 7.1 11.4 11.4 7.1 12 1.5z" />
    </svg>
  )
}

function Logo() {
  return (
    <div className="flex items-center gap-2" dir="ltr">
      <svg width="36" height="36" viewBox="0 0 48 48" fill="none">
        <circle cx="24" cy="24" r="10" fill="#4c447f" stroke="#f2c572" strokeWidth="1.5" />
        <ellipse cx="24" cy="24" rx="21" ry="7" transform="rotate(-25 24 24)" stroke="#f2c572" strokeWidth="1.8" />
      </svg>
      <div className="font-mono leading-tight tracking-[0.18em]" style={{ fontSize: '9px' }}>
        <div className="text-ink">SCIENCE</div>
        <div className="text-ink">FESTIVITY</div>
        <div className="text-star">2026</div>
      </div>
    </div>
  )
}

function GlobeIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function LangButton() {
  const { lang, t, toggleLang } = useLang()
  return (
    <button
      onClick={toggleLang}
      aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
      className="flex items-center gap-1.5 rounded-full transition"
      style={{
        background: 'rgba(14,19,38,0.6)',
        border: '1px solid rgba(79,214,196,0.35)',
        color: '#4fd6c4',
        fontFamily: 'IBM Plex Mono, monospace',
        fontWeight: 700,
        letterSpacing: '0.06em',
        backdropFilter: 'blur(8px)',
        cursor: 'pointer',
        boxShadow: '0 1px 8px rgba(0,0,0,0.35)',
        padding: '6px 8px',
        fontSize: '11px',
        lineHeight: 1,
      }}
    >
      <GlobeIcon size={14} />
      <span className="hidden sm:inline" style={{ fontSize: '11px' }}>{t.toggleLang}</span>
    </button>
  )
}

export default function SiteHeader({
  active,
  className = 'absolute inset-x-0 top-0 z-20',
}: {
  active: NavKey
  className?: string
}) {
  const { t } = useLang()

  const navLinks = [
    { key: 'home'   as NavKey, label: t.home,   to: '/' },
    { key: 'about'  as NavKey, label: t.about,  to: '/about' },
    { key: 'events' as NavKey, label: t.events, to: '/events' },
    { key: 'today'  as NavKey, label: t.today,  to: '/today' },
    { key: 'map'    as NavKey, label: t.map,    to: '/map' },
  ]

  return (
    <header className={`${className} px-4 sm:px-12 py-4 sm:py-5`}>

      {/* ── MOBILE layout (hidden on sm+) ─────────────────────────────────
          Row 1: nav links (start) | lang button (end)
          Row 2: logo centered
          Same structure as before — only font size reduced to fit 5 items */}
      <div className="flex flex-col gap-2 sm:hidden">
        <div className="flex items-center justify-between">
          <nav className="flex font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]"
               style={{ gap: '8px' }}>
            {navLinks.map((l) => (
              <Link
                key={l.key}
                to={l.to}
                style={{ fontSize: '9.5px', whiteSpace: 'nowrap' }}
                className={`pb-0.5 transition hover:text-white ${
                  l.key === active ? 'text-white border-b-2 border-star' : 'text-white/85'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <LangButton />
        </div>
        {/* logo row — centered, unchanged */}
        <div className="flex justify-center pt-0.5">
          <Logo />
        </div>
      </div>

      {/* ── DESKTOP layout (hidden below sm) — unchanged ──────────────────*/}
      <div className="hidden sm:flex items-center justify-between">
        <div className="flex items-center gap-8 text-ink/90">
          <span className="text-ink/80"><Sparkle /></span>
          <nav className="flex gap-8 text-sm font-bold drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
            {navLinks.map((l) => (
              <Link
                key={l.key}
                to={l.to}
                className={`pb-1 transition hover:text-white ${
                  l.key === active ? 'text-white border-b-2 border-star' : 'text-white/85'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <LangButton />
          <Logo />
        </div>
      </div>

    </header>
  )
}
