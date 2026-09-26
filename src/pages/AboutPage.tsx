import { Link } from 'react-router-dom'
import SiteHeader, { Sparkle } from '../components/SiteHeader'
import { useLang } from '../lib/langContext'
import bg from '../assets/landing-bg.webp'

function InfoRow({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-hairline bg-surface/70 px-4 py-3">
      <span className="mt-0.5 text-comet">{icon}</span>
      <div>
        <p className="text-[11px] font-mono tracking-widest text-ink-faint">{label}</p>
        <p className="text-sm sm:text-base font-semibold text-ink">{value}</p>
      </div>
    </div>
  )
}

export default function AboutPage() {
  const { t } = useLang()

  const audiences = [
    t.kindergarten,
    t.primary,
    t.preparatory,
    t.secondary_university,
    t.people_of_determination,
  ]

  return (
    <div className="relative min-h-dvh overflow-hidden bg-space-950">
      <img
        src={bg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-[15%_center] sm:object-center opacity-60"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-space-950/70 via-space-950/60 to-space-950/90"
      />

      <SiteHeader active="about" />

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-28 sm:pt-32">
        <Link to="/" className="mb-6 inline-block text-sm text-ink-dim hover:text-comet transition">
          {t.backHome}
        </Link>

        <div className="flex items-center gap-3 text-star mb-3">
          <Sparkle size={22} />
          <span className="h-px flex-1 bg-gradient-to-r from-white/40 to-transparent" />
        </div>

        <h1
          className="text-3xl sm:text-5xl font-extrabold text-white"
          style={{ textShadow: '0 0 24px rgba(140,180,255,0.55)' }}
        >
          {t.heroTitle}
        </h1>
        <p className="mt-2 text-base sm:text-xl text-comet font-semibold">{t.heroSubtitle}</p>

        <p className="mt-6 text-sm sm:text-base leading-relaxed text-ink-dim">{t.aboutIntro}</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <InfoRow
            label={t.aboutDatesLabel}
            value={t.aboutDates}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            }
          />
          <InfoRow
            label={t.aboutHoursLabel}
            value={t.aboutHours}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3.2 2" />
              </svg>
            }
          />
          <InfoRow
            label={t.aboutVenueLabel}
            value={t.aboutVenue}
            icon={
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            }
          />
        </div>

        <div className="mt-8">
          <p className="text-[11px] font-mono tracking-widest text-ink-faint mb-3">{t.aboutAudienceLabel}</p>
          <div className="flex flex-wrap gap-2">
            {audiences.map((a) => (
              <span
                key={a}
                className="text-xs sm:text-sm px-3 py-1.5 rounded-full border border-nebula/40 text-ink bg-nebula-dim/20"
              >
                {a}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            to="/map"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3 font-semibold text-white
              bg-gradient-to-r from-nebula to-sky-500 shadow-[0_0_24px_rgba(133,119,217,0.5)] hover:brightness-110 transition"
          >
            {t.exploreMap}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
