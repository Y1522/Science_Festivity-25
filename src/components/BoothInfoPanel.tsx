import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../lib/langContext'
import type { Booth } from '../lib/types'

export default function BoothInfoPanel({
  booth,
  onClose,
}: {
  booth: Booth | null
  onClose: () => void
}) {
  const { lang, t } = useLang()

  useEffect(() => {
    if (!booth) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [booth, onClose])

  const open = Boolean(booth)
  const activities = booth?.activities ?? []

  // helper: pick ar or en label for activity type
  const typeLabel = (a: typeof activities[0]) => {
    if (lang === 'en' && a.activity_type_en)
      return (t as any)[a.activity_type_en] ?? a.activity_type_en
    if (lang === 'ar')
      return (
        a.activity_type_ar ??
        (a.activity_type_en
          ? (t as any)[a.activity_type_en] ?? a.activity_type_en
          : '')
      )
    return a.activity_type_ar ?? ''
  }

  // institution name
  const instName = (a: typeof activities[0]) =>
    lang === 'en'
      ? a.institution_en ?? a.institution_ar ?? '—'
      : a.institution_ar ?? a.institution_en ?? '—'

  // description
  const desc = (a: typeof activities[0]) =>
    lang === 'en'
      ? a.description_en ?? a.description_ar ?? ''
      : a.description_ar ?? a.description_en ?? ''

  // zone name
  const zoneName = booth?.zone
    ? lang === 'en'
      ? booth.zone.name_en
      : booth.zone.name_ar
    : ''

  // infer activity type icon (size configurable for pill vs header)
  const typeIcon = (a: typeof activities[0], size = 10) => {
    const type = a.activity_type_en
    if (type === 'Workshop') {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      )
    }
    if (type === 'Storytelling') {
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
      )
    }
    // Presentation (default)
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    )
  }

  // Duration hint derived from the activity type
  const durationLabel = (a: typeof activities[0]) => {
    const durMap: Record<string, string> = { Workshop: '45 min', Presentation: '15 min', Storytelling: '20 min' }
    const durMapAr: Record<string, string> = { Workshop: '٤٥ دقيقة', Presentation: '١٥ دقيقة', Storytelling: '٢٠ دقيقة' }
    if (!a.activity_type_en) return null
    return lang === 'en' ? durMap[a.activity_type_en] ?? null : durMapAr[a.activity_type_en] ?? null
  }

  const pillStyle: React.CSSProperties = {
    background: 'rgba(42,52,83,0.7)',
    color: '#9aa3c0',
    border: '1px solid rgba(42,52,83,0.9)',
  }

  return (
    <>
      {/* Backdrop (click anywhere to close) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(4,6,13,0.45)', backdropFilter: 'blur(2px)' }}
      />

      {/* Side panel — pinned to the LEFT edge like the reference design:
          tent name on top, big booth number, scrollable details, pinned CTA. */}
      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 left-0 z-50 h-dvh w-[min(92vw,400px)] transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full pointer-events-none'
        }`}
      >
        {booth && (
          <div
            className="h-full flex flex-col rounded-r-3xl overflow-hidden"
            style={{
              background: 'rgba(10, 14, 28, 0.95)',
              border: '1px solid rgba(42, 52, 83, 0.9)',
              borderLeft: 'none',
              boxShadow: '0 0 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(79,214,196,0.07)',
              backdropFilter: 'blur(20px)',
            }}
          >
            {/* top neon accent line */}
            <div
              className="h-[3px] shrink-0"
              style={{ background: 'linear-gradient(90deg, #4fd6c4 0%, #8a7bff 50%, #f2c572 100%)' }}
            />

            {/* ── Header ── */}
            <div
              className="px-5 pt-4 pb-4 shrink-0"
              style={{
                background: 'linear-gradient(160deg, rgba(23,31,56,0.98) 0%, rgba(15,20,38,0.95) 100%)',
                borderBottom: '1px solid rgba(42,52,83,0.65)',
              }}
            >
              {/* Row: zone (tent) pill + close button */}
              <div className="flex items-center justify-between gap-2 mb-3">
                {zoneName ? (
                  <span
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                    style={{
                      background: 'rgba(79,214,196,0.08)',
                      border: '1px solid rgba(79,214,196,0.22)',
                      color: '#4fd6c4',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {zoneName}
                  </span>
                ) : (
                  <span />
                )}

                <button
                  onClick={onClose}
                  className="rounded-lg p-1.5 transition-colors"
                  style={{ color: '#616b8c' }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#eef0f8')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#616b8c')}
                  aria-label="Close"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Big booth number + type badge */}
              <div className="flex items-end gap-2.5">
                <span
                  className="font-mono text-6xl font-bold leading-none"
                  style={{ color: '#f2c572', textShadow: '0 0 24px rgba(242,197,114,0.55)' }}
                >
                  {booth.booth_number ?? '—'}
                </span>
                <span className="text-xs font-mono pb-1.5" style={{ color: '#616b8c' }}>
                  {t.roomNumber}
                </span>

                {activities[0]?.activity_type_en && (
                  <div
                    className="rounded-lg p-1.5 mb-1 ms-auto"
                    style={{
                      background: 'rgba(42,52,83,0.7)',
                      border: '1px solid rgba(79,214,196,0.25)',
                      color: '#4fd6c4',
                    }}
                  >
                    {typeIcon(activities[0], 16)}
                  </div>
                )}
              </div>

              {/* Institution name(s) as title */}
              <div className="mt-3 space-y-1">
                {activities.map((activity) => (
                  <h2
                    key={activity.activity_id}
                    className="text-base font-bold leading-snug"
                    style={{ color: '#eef0f8' }}
                  >
                    {instName(activity)}
                  </h2>
                ))}
              </div>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto px-5 py-4" style={{ scrollbarWidth: 'thin' }}>
              {activities.length === 0 ? (
                <p className="text-xs" style={{ color: '#616b8c' }}>
                  {t.noInfo}
                </p>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity, idx) => (
                    <div key={activity.activity_id} className="space-y-2.5">
                      {idx > 0 && (
                        <div
                          className="h-px"
                          style={{ background: 'linear-gradient(90deg, rgba(42,52,83,0.9) 0%, transparent 100%)' }}
                        />
                      )}

                      {/* Meta pills */}
                      <div className="flex flex-wrap gap-2">
                        {durationLabel(activity) && (
                          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full" style={pillStyle}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M12 6v6l4 2" />
                            </svg>
                            {durationLabel(activity)}
                          </span>
                        )}

                        {activity.activity_type_en && (
                          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full" style={pillStyle}>
                            {typeIcon(activity)}
                            {typeLabel(activity)}
                          </span>
                        )}

                        {activity.activity_dates && (
                          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full" style={pillStyle}>
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="4" width="18" height="18" rx="2" />
                              <path d="M16 2v4M8 2v4M3 10h18" />
                            </svg>
                            {activity.activity_dates}
                          </span>
                        )}
                      </div>

                      {/* Institution sub-label when a booth has multiple activities */}
                      {activities.length > 1 && (
                        <p className="text-[10px] font-semibold" style={{ color: '#4fd6c4' }}>
                          {instName(activity)}
                        </p>
                      )}

                      {desc(activity) && (
                        <p className="text-xs leading-relaxed" style={{ color: '#8b94b3' }}>
                          {desc(activity)}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── CTA pinned to bottom ── */}
            <div
              className="px-5 py-4 shrink-0"
              style={{ borderTop: '1px solid rgba(42,52,83,0.65)', background: 'rgba(10,14,28,0.6)' }}
            >
              <Link
                to={`/booth/${booth.booth_number}`}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: 'linear-gradient(135deg, rgba(79,214,196,0.15) 0%, rgba(79,214,196,0.08) 100%)',
                  border: '1px solid rgba(79,214,196,0.3)',
                  color: '#eef0f8',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'linear-gradient(135deg, rgba(79,214,196,0.25) 0%, rgba(79,214,196,0.15) 100%)'
                  el.style.borderColor = 'rgba(79,214,196,0.6)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.background = 'linear-gradient(135deg, rgba(79,214,196,0.15) 0%, rgba(79,214,196,0.08) 100%)'
                  el.style.borderColor = 'rgba(79,214,196,0.3)'
                }}
              >
                <span>{t.openPage}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </aside>
    </>
  )
}