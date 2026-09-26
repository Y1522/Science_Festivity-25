import { useLang } from '../lib/langContext'

/**
 * Floating language toggle button — fixed at top-center, above everything.
 * Place once in App.tsx so it appears on all pages.
 */
export default function LangToggle() {
  const { lang, t, toggleLang } = useLang()

  return (
    <button
      onClick={toggleLang}
      aria-label={lang === 'ar' ? 'Switch to English' : 'التبديل للعربية'}
      style={{
        position: 'fixed',
        /* On mobile the nav bar is ~56-64px tall; push the toggle below it.
           On larger screens 14 px is fine, so we use a clamp:
           – below sm (≤640 px) → 68 px  (below the nav)
           – sm and above       → 14 px                       */
        top: 'var(--lang-toggle-top, 14px)',
        // center horizontally
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '5px 14px',
        borderRadius: '999px',
        background: 'rgba(14,19,38,0.82)',
        border: '1px solid rgba(79,214,196,0.35)',
        backdropFilter: 'blur(12px)',
        color: '#4fd6c4',
        fontFamily: 'IBM Plex Mono, monospace',
        fontSize: '12px',
        fontWeight: 700,
        letterSpacing: '0.06em',
        cursor: 'pointer',
        transition: 'border-color 0.2s, background 0.2s',
        boxShadow: '0 2px 16px rgba(0,0,0,0.45)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = 'rgba(79,214,196,0.7)'
        el.style.background = 'rgba(14,19,38,0.95)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement
        el.style.borderColor = 'rgba(79,214,196,0.35)'
        el.style.background = 'rgba(14,19,38,0.82)'
      }}
    >
      {/* Globe icon */}
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      {t.toggleLang}
    </button>
  )
}
