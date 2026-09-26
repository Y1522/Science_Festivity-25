// TodayPage — عروض اليوم
// Shows today's schedule grouped by venue (outdoor stage, small theater, lecture hall).
// "Today" is determined by matching the current date to one of the 3 festival days.
// If today is not a festival day, shows the full 3-day schedule with day tabs.

import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'
import { scheduleItems, type ScheduleItem, type Venue } from '../lib/scheduleData'
import { useLang } from '../lib/langContext'

// ─── Venue display config ───────────────────────────────────────────────────

interface VenueMeta {
  venue: Venue
  labelAr: string
  labelEn: string
  icon: string
  dotColor: string
  pillBg: string
  pillText: string
  borderColor: string
  to: string
}

const VENUE_META: VenueMeta[] = [
  {
    venue: 'stage',
    labelAr: 'المسرح الخارجي',
    labelEn: 'Outdoor Stage',
    icon: '🎭',
    dotColor: '#9a8cff',
    pillBg: 'rgba(90,75,208,0.35)',
    pillText: '#c8c0ff',
    borderColor: 'rgba(90,75,208,0.5)',
    to: '/outdoor',
  },
  {
    venue: 'small-theater',
    labelAr: 'المسرح الصغير',
    labelEn: 'Small Theater',
    icon: '🌌',
    dotColor: '#35d0c0',
    pillBg: 'rgba(53,208,192,0.3)',
    pillText: '#a5f0e8',
    borderColor: 'rgba(53,208,192,0.45)',
    to: '/small-theater',
  },
  {
    venue: 'hall',
    labelAr: 'قاعة المحاضرات',
    labelEn: 'Lecture Hall',
    icon: '🎙️',
    dotColor: '#6fb4ff',
    pillBg: 'rgba(47,111,214,0.35)',
    pillText: '#a8d0ff',
    borderColor: 'rgba(47,111,214,0.45)',
    to: '/conference',
  },
]

// ─── Festival dates ──────────────────────────────────────────────────────────

const FESTIVAL_DATES: Array<'2026-09-26' | '2026-09-27' | '2026-09-28'> = [
  '2026-09-26',
  '2026-09-27',
  '2026-09-28',
]

const DAY_LABELS_AR: Record<string, string> = {
  '2026-09-26': 'السبت ٢٦ سبتمبر',
  '2026-09-27': 'الأحد ٢٧ سبتمبر',
  '2026-09-28': 'الاثنين ٢٨ سبتمبر',
}
const DAY_LABELS_EN: Record<string, string> = {
  '2026-09-26': 'Saturday 26 Sep',
  '2026-09-27': 'Sunday 27 Sep',
  '2026-09-28': 'Monday 28 Sep',
}

function todayDate(): string {
  return new Date().toISOString().slice(0, 10)
}

// ─── Event row ────────────────────────────────────────────────────────────────

function EventRow({ item, lang, meta }: { item: ScheduleItem; lang: 'ar' | 'en'; meta: VenueMeta }) {
  const title = lang === 'ar' ? item.titleAr : item.titleEn
  const time  = lang === 'ar' ? item.timeLabelAr : item.timeLabelEn

  return (
    <div
      className="flex flex-col gap-1.5 rounded-xl px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4 sm:py-3 transition hover:bg-white/[0.04]"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <span
        className="hidden sm:block shrink-0 h-2 w-2 rounded-full"
        style={{ background: meta.dotColor, boxShadow: `0 0 6px ${meta.dotColor}` }}
        aria-hidden
      />
      <p className="flex-1 text-[15px] font-semibold text-white leading-snug">{title}</p>
      <span
        className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-3 py-1 text-[11px] font-bold tracking-wide"
        style={{ background: meta.pillBg, color: meta.pillText }}
        dir="ltr"
      >
        {time}
      </span>
    </div>
  )
}

// ─── Venue block for one day ─────────────────────────────────────────────────

function VenueBlock({
  meta,
  items,
  lang,
}: {
  meta: VenueMeta
  items: ScheduleItem[]
  lang: 'ar' | 'en'
}) {
  if (items.length === 0) return null
  const label = lang === 'ar' ? meta.labelAr : meta.labelEn

  return (
    <div
      className="rounded-2xl overflow-hidden border"
      style={{ borderColor: meta.borderColor, background: 'rgba(14,20,50,0.7)', backdropFilter: 'blur(8px)' }}
    >
      {/* venue header */}
      <Link
        to={meta.to}
        className="flex items-center gap-2.5 px-5 py-3 transition hover:brightness-110"
        style={{ background: `linear-gradient(90deg, ${meta.borderColor} 0%, rgba(14,20,50,0.9) 100%)` }}
      >
        <span className="text-lg">{meta.icon}</span>
        <h3 className="text-sm font-extrabold text-white tracking-wide">{label}</h3>
        <span className="ms-auto text-white/50 text-xs">→</span>
      </Link>

      <div className="px-2 py-1">
        {items.map((item) => (
          <EventRow key={item.id} item={item} lang={lang} meta={meta} />
        ))}
      </div>
    </div>
  )
}

// ─── Day panel ───────────────────────────────────────────────────────────────

function DayPanel({ date, lang }: { date: string; lang: 'ar' | 'en' }) {
  const dayItems = useMemo(
    () => scheduleItems.filter((i) => i.date === date),
    [date],
  )

  return (
    <div className="space-y-4">
      {VENUE_META.map((meta) => {
        const items = dayItems
          .filter((i) => i.venue === meta.venue)
          .sort((a, b) => a.startTime.localeCompare(b.startTime))
        return <VenueBlock key={meta.venue} meta={meta} items={items} lang={lang} />
      })}
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TodayPage() {
  const { lang } = useLang()
  const today = todayDate()
  const isFestivalDay = FESTIVAL_DATES.includes(today as typeof FESTIVAL_DATES[number])

  // default tab: today if it's a festival day, else first day
  const defaultTab = isFestivalDay ? today : FESTIVAL_DATES[0]
  const [activeDate, setActiveDate] = useState<string>(defaultTab)

  const pageTitle    = lang === 'ar' ? 'عروض اليوم' : "Today's Shows"
  const pageSubtitle = lang === 'ar'
    ? 'برنامج العروض في المسرح الخارجي والصغير وقاعة المحاضرات'
    : 'Schedule for the outdoor stage, small theater & lecture hall'

  const isTodayBanner = isFestivalDay && activeDate === today

  return (
    <div
      className="relative min-h-dvh"
      style={{ background: 'linear-gradient(160deg, #090c1e 0%, #0d1232 40%, #0a0f28 100%)' }}
    >
      {/* star dots */}
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

      <SiteHeader active="today" className="relative z-20" />

      <main className="relative z-10 mx-auto max-w-3xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8">

        {/* heading */}
        <header className="mb-8 text-center sm:mb-10">
          <h1
            className="text-3xl font-extrabold text-white sm:text-5xl"
            style={{ textShadow: '0 0 24px rgba(140,180,255,0.5)' }}
          >
            {pageTitle}
          </h1>
          <p className="mt-2 text-sm text-[#8a9acc] sm:text-base">{pageSubtitle}</p>
          <div className="mt-4 flex items-center justify-center gap-3" dir="ltr">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[#4d6fe0]/60 sm:w-24" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#5b8cff]" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[#4d6fe0]/60 sm:w-24" />
          </div>
        </header>

        {/* back link */}
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#8fa3d0] transition hover:text-white"
        >
          {lang === 'ar' ? '← العودة للرئيسية' : '← Back to Home'}
        </Link>

        {/* "today" live badge */}
        {isTodayBanner && (
          <div
            className="mb-5 mt-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
            style={{ background: 'rgba(79,214,196,0.12)', border: '1px solid rgba(79,214,196,0.35)', color: '#4fd6c4' }}
          >
            <span className="inline-block h-2 w-2 rounded-full bg-[#4fd6c4] animate-pulse" />
            {lang === 'ar' ? 'يعرض الآن — برنامج اليوم' : 'Live now — today\'s program'}
          </div>
        )}

        {/* day tabs */}
        <div className="mb-6 mt-3 flex gap-2 overflow-x-auto pb-1" dir="ltr">
          {FESTIVAL_DATES.map((d) => {
            const label = lang === 'ar' ? DAY_LABELS_AR[d] : DAY_LABELS_EN[d]
            const isActive = activeDate === d
            const isToday  = d === today
            return (
              <button
                key={d}
                onClick={() => setActiveDate(d)}
                className="shrink-0 rounded-full px-4 py-2 text-xs font-bold transition"
                style={{
                  background: isActive ? 'rgba(91,140,255,0.3)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${isActive ? 'rgba(91,140,255,0.7)' : 'rgba(255,255,255,0.12)'}`,
                  color: isActive ? '#c0d8ff' : '#8a9acc',
                  boxShadow: isActive ? '0 0 12px rgba(91,140,255,0.2)' : 'none',
                }}
              >
                {label}
                {isToday && (
                  <span
                    className="ms-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#4fd6c4] align-middle"
                    title={lang === 'ar' ? 'اليوم' : 'Today'}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* schedule for selected day */}
        <DayPanel date={activeDate} lang={lang} />
      </main>
    </div>
  )
}
