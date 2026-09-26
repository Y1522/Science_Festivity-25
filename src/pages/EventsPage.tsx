// EventsPage — صفحة الفعاليات
// Shows all three venues (outdoor stage, small theater, lecture hall) in a
// clean list layout. Each event row: title on the left + bold small pill for
// location & time on the right. Intentionally simpler background than the map
// inner pages, to contrast with the venue-detail cards.

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import { scheduleItems, type ScheduleItem, type Venue } from '../lib/scheduleData'
import { useLang } from '../lib/langContext'

// ─── Venue config ──────────────────────────────────────────────────────────

interface VenueConfig {
  venue: Venue
  labelAr: string
  labelEn: string
  subtitleEn: string
  accent: string          // Tailwind bg class for the section pill
  dotColor: string        // inline style colour for the left dot on each row
  pillBg: string          // inline bg for the time+location pill
  pillText: string        // inline text colour for the pill
  to: string              // deep-link to the VenuePage
}

const VENUE_CONFIG: VenueConfig[] = [
  {
    venue: 'stage',
    labelAr: 'المسرح الخارجي',
    labelEn: 'Outdoor Stage',
    subtitleEn: 'OUTDOOR STAGE',
    accent: 'from-[#5a4bd0] to-[#2c2a8a]',
    dotColor: '#9a8cff',
    pillBg: 'rgba(90,75,208,0.35)',
    pillText: '#c8c0ff',
    to: '/outdoor',
  },
  {
    venue: 'small-theater',
    labelAr: 'المسرح الصغير',
    labelEn: 'Small Theater',
    subtitleEn: 'SMALL THEATER',
    accent: 'from-[#35d0c0] to-[#0b8378]',
    dotColor: '#35d0c0',
    pillBg: 'rgba(53, 208, 192, 0.3)',
    pillText: '#a5f0e8',
    to: '/small-theater',
  },
  {
    venue: 'hall',
    labelAr: 'قاعة المحاضرات',
    labelEn: 'Lecture Hall',
    subtitleEn: 'LECTURE HALL',
    accent: 'from-[#2f6fd6] to-[#1b3d8f]',
    dotColor: '#6fb4ff',
    pillBg: 'rgba(47,111,214,0.35)',
    pillText: '#a8d0ff',
    to: '/conference',
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────

function groupByDate(items: ScheduleItem[]): [string, ScheduleItem[]][] {
  const map = new Map<string, ScheduleItem[]>()
  for (const item of items) {
    map.set(item.date, [...(map.get(item.date) ?? []), item])
  }
  return [...map.entries()]
}

// ─── Event row ─────────────────────────────────────────────────────────────

function EventRow({
  item,
  lang,
  cfg,
}: {
  item: ScheduleItem
  lang: 'ar' | 'en'
  cfg: VenueConfig
}) {
  const title = lang === 'en' ? item.titleEn : item.titleAr
  const time = lang === 'en' ? item.timeLabelEn : item.timeLabelAr
  const location = lang === 'en' ? item.locationEn.split(',').pop()?.trim() ?? item.locationEn
                                 : item.locationAr.split('،').pop()?.trim() ?? item.locationAr

  return (
    <div
      className="flex flex-col gap-1.5 rounded-xl px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4 sm:py-3 transition hover:bg-white/[0.04]"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* coloured dot */}
      <span
        className="hidden sm:block shrink-0 h-2 w-2 rounded-full mt-[3px]"
        style={{ background: cfg.dotColor, boxShadow: `0 0 6px ${cfg.dotColor}` }}
        aria-hidden
      />

      {/* event title */}
      <p className="flex-1 text-[15px] font-semibold text-white leading-snug sm:text-base">
        {title}
      </p>

      {/* time + location pill */}
      <span
        className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide"
        style={{ background: cfg.pillBg, color: cfg.pillText }}
        dir="ltr"
      >
        <span>{time}</span>
        <span aria-hidden className="opacity-50">·</span>
        <span>{location}</span>
      </span>
    </div>
  )
}

// ─── Venue section ─────────────────────────────────────────────────────────

function VenueSection({ cfg, lang }: { cfg: VenueConfig; lang: 'ar' | 'en' }) {
  const label = lang === 'en' ? cfg.labelEn : cfg.labelAr

  const items = useMemo(
    () =>
      scheduleItems
        .filter((i) => i.venue === cfg.venue)
        .sort((a, b) => (a.date + a.startTime).localeCompare(b.date + b.startTime)),
    [cfg.venue],
  )

  const groups = useMemo(() => groupByDate(items), [items])

  return (
    <section className="rounded-2xl overflow-hidden border border-white/10"
      style={{ background: 'rgba(14,20,50,0.7)', backdropFilter: 'blur(8px)' }}
    >
      {/* section header */}
      <Link
        to={cfg.to}
        className={`flex items-center justify-between px-5 py-3.5 bg-gradient-to-r ${cfg.accent} transition hover:brightness-110`}
      >
        <h2 className="text-base sm:text-lg font-extrabold text-white tracking-wide">{label}</h2>
        <span className="text-white/80 text-sm font-mono tracking-[0.25em]">{cfg.subtitleEn} →</span>
      </Link>

      {/* events by day */}
      <div className="px-2 py-1">
        {groups.map(([date, list]) => (
          <div key={date} className="mb-2 mt-3 last:mb-1">
            {/* day label */}
            <p className="mb-1.5 px-2 text-[11px] font-bold uppercase tracking-widest"
               style={{ color: cfg.dotColor }}>
              {lang === 'en' ? list[0].dayLabelEn : list[0].dayLabelAr}
            </p>
            {list.map((item) => (
              <EventRow key={item.id} item={item} lang={lang} cfg={cfg} />
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const { lang, t } = useLang()

  return (
    <div
      className="relative min-h-dvh"
      style={{ background: 'linear-gradient(160deg, #090c1e 0%, #0d1232 40%, #0a0f28 100%)' }}
    >
      {/* subtle star-dot overlay */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: [
            'radial-gradient(1px 1px at 80px 60px, rgba(238,240,248,0.45), transparent)',
            'radial-gradient(1px 1px at 200px 130px, rgba(238,240,248,0.3), transparent)',
            'radial-gradient(1.5px 1.5px at 320px 80px, rgba(238,240,248,0.4), transparent)',
            'radial-gradient(1px 1px at 450px 200px, rgba(238,240,248,0.25), transparent)',
            'radial-gradient(1px 1px at 560px 50px, rgba(238,240,248,0.35), transparent)',
            'radial-gradient(1.5px 1.5px at 700px 160px, rgba(238,240,248,0.3), transparent)',
          ].join(','),
          backgroundSize: '780px 280px',
          backgroundRepeat: 'repeat',
        }}
      />

      <SiteHeader active="events" className="relative z-20" />

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
        {/* page heading */}
        <header className="mb-8 text-center sm:mb-10">
          <h1
            className="text-3xl font-extrabold text-white sm:text-5xl"
            style={{ textShadow: '0 0 24px rgba(140,180,255,0.5)' }}
          >
            {t.eventsPageTitle}
          </h1>
          <p className="mt-2 text-sm text-[#8a9acc] sm:text-base">{t.eventsPageSubtitle}</p>
          <div className="mt-4 flex items-center justify-center gap-3" dir="ltr">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#4d6fe0]/60 sm:w-24" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#5b8cff]" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#4d6fe0]/60 sm:w-24" />
          </div>
        </header>

        {/* back to home */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#8fa3d0] transition hover:text-white"
        >
          {t.backHome}
        </Link>

        {/* venue sections */}
        <div className="mt-4 space-y-6">
          {VENUE_CONFIG.map((cfg) => (
            <VenueSection key={cfg.venue} cfg={cfg} lang={lang} />
          ))}
        </div>
      </main>
    </div>
  )
}