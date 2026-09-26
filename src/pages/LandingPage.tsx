import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import { useLang } from '../lib/langContext'
import bg from '../assets/landing-bg.webp'

export default function LandingPage() {
  const { t } = useLang()

  return (
    <div className="relative min-h-dvh overflow-hidden bg-space-950">
      <img
        src={bg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover object-[15%_center] sm:object-center"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-space-950/70 via-space-950/5 to-space-950/70
          sm:from-space-950/50 sm:via-transparent sm:to-space-950/60"
      />

      <SiteHeader active="home" />

      <main
        className="relative z-10 flex min-h-dvh flex-col items-center justify-start px-4 pt-[24dvh] text-center
          sm:justify-center sm:px-6 sm:pt-0"
      >
        <h1
          className="text-[32px] min-[400px]:text-4xl sm:text-7xl font-extrabold text-white leading-tight"
          style={{ textShadow: '0 0 28px rgba(140,180,255,0.65), 0 0 70px rgba(120,110,255,0.4)' }}
        >
          {t.heroTitle}
        </h1>
        <p className="mt-3 sm:mt-5 text-base sm:text-2xl text-ink/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          {t.heroSubtitle}
        </p>
        <Link
          to="/map"
          className="mt-8 sm:mt-10 inline-flex items-center gap-3 rounded-full border border-white/25
            px-8 py-3 sm:px-9 sm:py-3.5 font-semibold text-white
            bg-gradient-to-r from-nebula to-sky-500
            shadow-[0_0_32px_rgba(133,119,217,0.55)] hover:brightness-110 transition"
        >
          {t.exploreMap}
          <span aria-hidden>→</span>
        </Link>
      </main>
    </div>
  )
}
