import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SiteHeader, { Sparkle } from '../components/SiteHeader'
import VillageScene from '../components/VillageScene'
import { fetchZones } from '../lib/queries'
import { useLang } from '../lib/langContext'
import type { Zone } from '../lib/types'
import bg from '../assets/map-bg.webp'

const iconProps = {
  className: 'h-8 w-8 sm:h-10 sm:w-10',
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

function StageIcon() {
  return (
    <svg {...iconProps}>
      <path d="M6 42V22L24 6l18 16v20" />
      <path d="M14 42V26a10 10 0 0 1 20 0v16" />
      <path d="M4 42h40" />
      <path d="M24 6v6" />
    </svg>
  )
}

function HallIcon() {
  return (
    <svg {...iconProps}>
      <rect x="8" y="5" width="32" height="18" rx="3" />
      <circle cx="24" cy="14" r="3.5" />
      <circle cx="13" cy="32" r="3" />
      <circle cx="24" cy="32" r="3" />
      <circle cx="35" cy="32" r="3" />
      <path d="M8 43c0-3 2.5-5 5-5s5 2 5 5M19 43c0-3 2.5-5 5-5s5 2 5 5M30 43c0-3 2.5-5 5-5s5 2 5 5" />
    </svg>
  )
}

function SmallTheaterIcon() {
  return (
    <svg {...iconProps}>
      {/* curtains */}
      <path d="M6 6 Q11 18 8 34 L6 34 Z" />
      <path d="M42 6 Q37 18 40 34 L42 34 Z" />
      {/* stage floor */}
      <path d="M8 34 Q24 39 40 34 L40 40 Q24 45 8 40 Z" />
      {/* spotlight beam */}
      <path d="M24 8 L14 34 L34 34 Z" strokeOpacity="0.55" />
      {/* spotlight */}
      <circle cx="24" cy="7" r="3.5" />
    </svg>
  )
}

function VenueCard({
  to,
  label,
  tint,
  glow,
  icon,
}: {
  to: string
  label: string
  tint: string
  glow: string
  icon: ReactNode
}) {
  return (
    <Link
      to={to}
      className={`group flex flex-col items-center justify-center gap-2 rounded-xl border
        bg-gradient-to-b ${tint} px-3 py-4 sm:py-5 text-center
        transition hover:-translate-y-0.5 hover:brightness-110`}
      style={{ boxShadow: `0 0 20px ${glow}` }}
    >
      <span className="text-white">{icon}</span>
      <span className="text-sm sm:text-lg font-bold text-white">{label}</span>
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0e1326] text-white transition group-hover:bg-[#1f2942]"
      >
        →
      </span>
    </Link>
  )
}

export default function MapPage() {
  const navigate = useNavigate()
  const { t } = useLang()
  const [zones, setZones] = useState<Zone[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchZones()
      .then(setZones)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="relative min-h-dvh bg-space-950">
      <img
        src={bg}
        alt=""
        aria-hidden
        className="fixed inset-0 h-full w-full object-cover object-[10%_center] sm:object-center"
        style={{ zIndex: 0 }}
      />

      <SiteHeader active="map" className="relative z-10" />

      <main className="relative z-10 mx-auto max-w-5xl px-4 pb-28 text-center">
        <div className="flex items-center justify-center gap-3 text-star">
          <span className="h-px w-16 sm:w-28 bg-gradient-to-l from-white/60 to-transparent" />
          <Sparkle size={26} />
          <span className="h-px w-16 sm:w-28 bg-gradient-to-r from-white/60 to-transparent" />
        </div>
        <h1
          className="mt-2 text-3xl sm:text-5xl font-extrabold text-white"
          style={{ textShadow: '0 0 24px rgba(140,180,255,0.55)' }}
        >
          {t.discoverVillage}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm sm:text-lg font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          {t.discoverDesc}
        </p>

        <div className="relative mt-4">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-[4%] inset-y-[14%] rounded-[50%] border border-white/15"
          />
          {loading && (
            <p className="flex h-[40vh] sm:h-[46vh] items-center justify-center text-ink-dim">
              {t.loadingTents}
            </p>
          )}
          {error && (
            <p className="flex h-[40vh] sm:h-[46vh] items-center justify-center text-red-400">
              {t.errorTents}: {error}
            </p>
          )}
          {!loading && !error && (
            <VillageScene
              zones={zones}
              onSelectZone={(zone) => navigate(`/tent/${zone.zone_code}`)}
            />
          )}
        </div>
        <p className="mt-1 text-xs sm:text-sm font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
          {t.dragRotate}
        </p>

        {/* 3-column venue cards */}
        <div className="mx-auto mt-5 grid max-w-2xl grid-cols-3 gap-3 sm:gap-4">
          <VenueCard
            to="/outdoor"
            label={t.outdoorStage}
            tint="from-[#9b8cff] to-[#4c3a9e] border-[#c9bcff]"
            glow="rgba(155, 140, 255, 0.4)"
            icon={<StageIcon />}
          />
          <VenueCard
            to="/small-theater"
            label={t.smallTheater}
            tint="from-[#35d0c0] to-[#0b8378] border-[#7deede]"
            glow="rgba(53, 208, 192, 0.4)"
            icon={<SmallTheaterIcon />}
          />
          <VenueCard
            to="/conference"
            label={t.conferenceHall}
            tint="from-[#58a6ff] to-[#1f56c9] border-[#9ec9ff]"
            glow="rgba(88, 166, 255, 0.4)"
            icon={<HallIcon />}
          />
        </div>
      </main>
    </div>
  )
}