import { useMemo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { scheduleByVenue, type ScheduleItem, type Venue } from '../lib/scheduleData'
import { useLang } from '../lib/langContext'
import bg from '../assets/background-space.png'

// ─── SVG helpers ────────────────────────────────────────────────────────────

const GRAD = (id: string) => (
  <defs>
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor="#6fb4ff" />
      <stop offset="1" stopColor="#9b6bff" />
    </linearGradient>
  </defs>
)

function Star4({ className = '', size = 14 }: { className?: string; size?: number }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 0c.7 6.6 4.9 10.8 12 12-7.1 1.2-11.3 5.4-12 12-.7-6.6-4.9-10.8-12-12C7.1 10.8 11.3 6.6 12 0z" />
    </svg>
  )
}

function PlanetIcon() {
  return (
    <svg width="84" height="84" viewBox="0 0 64 64" fill="none" aria-hidden>
      {GRAD('vg-planet')}
      <g transform="rotate(-22 32 34)">
        <path d="M3 34a29 8.5 0 0 1 58 0" stroke="#8fc1ff" strokeWidth="2.4" strokeLinecap="round" opacity=".8" />
      </g>
      <circle cx="32" cy="34" r="15" fill="url(#vg-planet)" />
      <ellipse cx="27" cy="29" rx="7" ry="4.5" fill="#fff" opacity=".18" transform="rotate(-25 27 29)" />
      <g transform="rotate(-22 32 34)">
        <path d="M3 34a29 8.5 0 0 0 58 0" stroke="#a9d0ff" strokeWidth="2.6" strokeLinecap="round" />
      </g>
      <path d="M50 8l1.2 3.3L54.5 12.5 51.2 13.7 50 17l-1.2-3.3L45.5 12.5l3.3-1.2z" fill="#9fc4ff" />
    </svg>
  )
}

function PavilionIcon() {
  return (
    <svg width="96" height="96" viewBox="0 0 64 64" fill="none" stroke="url(#vg-pav)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {GRAD('vg-pav')}
      <path d="M32 3v8M32 4l8 2.5-8 2.5" />
      <path d="M10 27Q32 8 54 27" />
      <path d="M7 27h50" />
      <path d="M13 27v25M23 27v25M32 27v25M41 27v25M51 27v25" />
      <path d="M8 52h48M11 57h42" />
      <path d="M22 27l10 12 10-12" opacity=".6" />
    </svg>
  )
}

function MicIcon() {
  return (
    <svg width="46" height="62" viewBox="0 0 48 64" fill="none" aria-hidden>
      {GRAD('vg-mic')}
      <rect x="15" y="4" width="18" height="32" rx="9" fill="url(#vg-mic)" />
      <path d="M15 14h18M15 20h18M15 26h18" stroke="#0d1748" strokeWidth="1.4" opacity=".35" />
      <path d="M7 27c0 10 7.6 17 17 17s17-7 17-17" stroke="url(#vg-mic)" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M24 44v12M14 58h20" stroke="url(#vg-mic)" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  )
}

function StageIconLg() {
  return (
    <svg width="62" height="62" viewBox="0 0 64 64" fill="none" stroke="url(#vg-stage)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {GRAD('vg-stage')}
      <path d="M20 7v6l5-2zM32 4v6l5-2zM44 7v6l5-2z" fill="url(#vg-stage)" strokeWidth="1.2" />
      <path d="M9 20h46" />
      <path d="M13 20v32M51 20v32" />
      <path d="M22 20v32M32 20v32M42 20v32" opacity=".55" />
      <path d="M13 22h38v28H13z" fill="url(#vg-stage)" opacity=".18" stroke="none" />
      <path d="M7 52h50M10 57h44" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f6c343" strokeWidth="2" strokeLinecap="round" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5b95ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" />
      <circle cx="17.5" cy="9" r="2.4" />
      <path d="M17 14.2c2.6.2 4.5 2.1 4.5 5" />
    </svg>
  )
}

function Chevron() {
  return (
    <svg width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="#4d8dff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M3 3l8 8-8 8" />
    </svg>
  )
}

// ─── Shared pieces ───────────────────────────────────────────────────────────

const CHAMFER = 16
const cardClip = `polygon(${CHAMFER}px 0, calc(100% - ${CHAMFER}px) 0, 100% ${CHAMFER}px, 100% calc(100% - ${CHAMFER}px), calc(100% - ${CHAMFER}px) 100%, ${CHAMFER}px 100%, 0 calc(100% - ${CHAMFER}px), 0 ${CHAMFER}px)`

function Card({ children }: { children: ReactNode }) {
  return (
    <article style={{ filter: 'drop-shadow(0 0 16px rgba(72,108,255,0.28))' }}>
      <div
        style={{
          clipPath: cardClip,
          padding: 1.5,
          background: 'linear-gradient(135deg,#4f8dff 0%,#6a5cff 55%,#8f6bff 100%)',
        }}
      >
        <div
          className="relative"
          style={{
            clipPath: cardClip,
            background: 'linear-gradient(115deg, rgba(12,24,74,0.93) 0%, rgba(14,26,84,0.9) 60%, rgba(10,18,60,0.95) 100%)',
          }}
        >
          {children}
        </div>
      </div>
    </article>
  )
}

function TimeChip({ time }: { time: string }) {
  return (
    <span
      dir="ltr"
      className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#4a67d6]/80 bg-[#0a1238]/90 px-4 py-1.5"
      style={{ boxShadow: '0 0 12px rgba(80,110,255,0.25)' }}
    >
      <ClockIcon />
      <span className="font-mono text-lg font-medium text-[#ffd35a]">{time}</span>
    </span>
  )
}

function Medallion({ children }: { children: ReactNode }) {
  return (
    <div className="relative shrink-0">
      <div
        className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full border border-[#4d6fe0]/70 sm:h-[112px] sm:w-[112px]"
        style={{
          background: 'radial-gradient(circle at 50% 38%, rgba(88,120,255,0.38), rgba(22,34,100,0.5) 68%)',
          boxShadow: '0 0 22px rgba(80,110,255,0.35), inset 0 0 18px rgba(80,110,255,0.25)',
        }}
      >
        <span className="absolute -inset-[7px] rounded-full border border-[#4d6fe0]/25" aria-hidden />
        <div className="scale-[.72] sm:scale-100">{children}</div>
        <Star4 className="absolute -right-1 top-3 text-[#7ea6ff]" size={10} />
        <Star4 className="absolute -left-1 bottom-4 text-[#7ea6ff]/80" size={8} />
      </div>
    </div>
  )
}

// ─── Hall card ───────────────────────────────────────────────────────────────

function HallCard({ item, lang }: { item: ScheduleItem; lang: 'ar' | 'en' }) {
  const title = lang === 'en' ? item.titleEn : item.titleAr
  const description = lang === 'en' ? item.descriptionEn : item.descriptionAr
  const time = lang === 'en' ? item.timeLabelEn : item.timeLabelAr
  const location = lang === 'en' ? item.locationEn : item.locationAr

  return (
    <Card>
      <span
        aria-hidden
        className="absolute inset-y-3 start-0 w-[4px] rounded-full"
        style={{ background: 'linear-gradient(180deg,#3d7bff,#8a5cff)', boxShadow: '0 0 12px rgba(90,120,255,0.8)' }}
      />
      <div className="flex items-center gap-3 px-4 py-5 sm:gap-5 sm:px-7">
        <span className="hidden sm:block rtl:rotate-180"><Chevron /></span>
        <Medallion><MicIcon /></Medallion>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <h2 className="text-xl font-bold leading-snug text-white sm:text-[26px]">{title}</h2>
            <TimeChip time={time} />
          </div>
          {description && (
            <p className="mt-3 text-[14px] leading-8 text-[#9fb2f2] sm:text-[15px]">{description}</p>
          )}
          <p className="mt-2 text-xs text-[#7c8cd6]">{location}</p>
        </div>
      </div>
      <span className="absolute bottom-3 start-5 flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#4d8dff]" />)}
      </span>
    </Card>
  )
}

// ─── Stage card ──────────────────────────────────────────────────────────────

function StageCard({ item, lang }: { item: ScheduleItem; lang: 'ar' | 'en' }) {
  const title = lang === 'en' ? item.titleEn : item.titleAr
  const time = lang === 'en' ? item.timeLabelEn : item.timeLabelAr
  const audience = lang === 'en' ? item.audienceEn : item.audienceAr

  return (
    <Card>
      {/* ── Mobile layout: stacked (TimeChip above title) ── */}
      <div className="flex flex-col gap-3 px-4 py-5 sm:hidden">
        <TimeChip time={time} />
        <div className="flex items-center gap-3">
          <Medallion><StageIconLg /></Medallion>
          <div className="min-w-0 flex-1 text-start">
            <h2 className="text-lg font-bold leading-snug text-white">{title}</h2>
            <span className="my-2 block h-px w-full bg-gradient-to-l from-[#4f7dff] via-[#3b58c8]/60 to-transparent" />
            <span className="flex items-center gap-2 text-[13px] text-[#8fb0ff]">
              <UsersIcon />
              {audience}
            </span>
          </div>
        </div>
      </div>

      {/* ── Desktop layout: row with TimeChip on the side ── */}
      <div className="hidden sm:flex items-center gap-6 px-8 py-6">
        <span className="rtl:rotate-180"><Chevron /></span>
        <Medallion><StageIconLg /></Medallion>

        <div className="min-w-0 flex-1 self-stretch text-start">
          <div className="flex h-full flex-col justify-center">
            <h2 className="text-[27px] font-bold leading-snug text-white">{title}</h2>
            <span className="my-3 block h-px w-full bg-gradient-to-l from-[#4f7dff] via-[#3b58c8]/60 to-transparent" />
            <span className="flex items-center gap-2 text-[15px] text-[#8fb0ff]">
              <UsersIcon />
              {audience}
            </span>
          </div>
        </div>

        <div className="relative flex items-center self-stretch ps-6">
          <span
            aria-hidden
            className="absolute start-[-6px] top-1/2 h-[72px] w-[3px] -translate-y-1/2 rounded-full"
            style={{ background: 'linear-gradient(180deg,#3d7bff,#5a3fd6)', boxShadow: '0 0 10px rgba(90,120,255,0.7)' }}
          />
          <TimeChip time={time} />
        </div>
      </div>
    </Card>
  )
}

// ─── Small Theater icon & card ───────────────────────────────────────────────

function SmallTheaterIcon() {
  return (
    <svg width="72" height="72" viewBox="0 0 64 64" fill="none" aria-hidden>
      {GRAD('vg-sm')}
      {/* curtain left */}
      <path d="M8 6 Q14 22 10 40 L8 40 Z" fill="url(#vg-sm)" opacity=".7" />
      {/* curtain right */}
      <path d="M56 6 Q50 22 54 40 L56 40 Z" fill="url(#vg-sm)" opacity=".7" />
      {/* stage floor */}
      <path d="M10 40 Q32 46 54 40 L54 48 Q32 54 10 48 Z" fill="url(#vg-sm)" opacity=".45" />
      {/* spotlight beam */}
      <path d="M32 10 L18 40 L46 40 Z" fill="url(#vg-sm)" opacity=".18" />
      {/* spotlight circle */}
      <circle cx="32" cy="9" r="4.5" fill="url(#vg-sm)" opacity=".9" />
      {/* star decoration */}
      <path d="M48 14l1 2.8 2.8 1-2.8 1L48 21.6l-1-2.8L44.2 17.8l2.8-1z" fill="#9fc4ff" />
    </svg>
  )
}

function SmallTheaterCard({ item, lang }: { item: ScheduleItem; lang: 'ar' | 'en' }) {
  const title = lang === 'en' ? item.titleEn : item.titleAr
  const description = lang === 'en' ? item.descriptionEn : item.descriptionAr
  const time = lang === 'en' ? item.timeLabelEn : item.timeLabelAr
  const location = lang === 'en' ? item.locationEn : item.locationAr

  return (
    <Card>
      <span
        aria-hidden
        className="absolute inset-y-3 start-0 w-[4px] rounded-full"
        style={{ background: 'linear-gradient(180deg,#f6c343,#ff8c42)', boxShadow: '0 0 12px rgba(246,195,67,0.7)' }}
      />
      <div className="flex items-center gap-3 px-4 py-5 sm:gap-5 sm:px-7">
        <span className="hidden sm:block rtl:rotate-180"><Chevron /></span>
        <Medallion>
          <SmallTheaterIcon />
        </Medallion>
        <div className="min-w-0 flex-1">
          <div className="flex flex-col-reverse items-start gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <h2 className="text-xl font-bold leading-snug text-white sm:text-[26px]">{title}</h2>
            <TimeChip time={time} />
          </div>
          {description && (
            <p className="mt-3 text-[14px] leading-8 text-[#f0d48a]/80 sm:text-[15px]">{description}</p>
          )}
          <p className="mt-2 text-xs text-[#c8a060]">{location}</p>
        </div>
      </div>
      <span className="absolute bottom-3 start-5 flex gap-1" aria-hidden>
        {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-[#f6c343]" />)}
      </span>
    </Card>
  )
}

// ─── Decorations ─────────────────────────────────────────────────────────────

function Decor({ variant }: { variant: Venue }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      {variant === 'hall' ? (
        <>
          <div
            className="absolute -start-20 top-24 h-52 w-52 rounded-full"
            style={{
              background: 'radial-gradient(circle at 70% 40%, rgba(70,100,220,0.28), rgba(30,50,140,0.14) 55%, transparent 72%)',
              border: '1px solid rgba(90,120,255,0.25)',
            }}
          />
          <Star4 className="absolute end-[7%] top-[9%] text-[#7ea6ff]" size={26} />
          <Star4 className="absolute end-[5%] top-[13%] text-[#7ea6ff]/70" size={14} />
          <Star4 className="absolute start-[6%] top-[13%] text-[#7ea6ff]/70" size={10} />
        </>
      ) : (
        <>
          <div
            className="absolute -end-10 -top-6 h-32 w-32 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 30%, #5f7dff, #23328f 70%)',
              boxShadow: '0 0 40px rgba(90,120,255,0.45)',
            }}
          />
          <div
            className="absolute -end-24 top-2 h-16 w-72 -rotate-[14deg] rounded-[50%] border border-[#7aa2ff]/60"
            style={{ boxShadow: '0 0 18px rgba(110,150,255,0.35)' }}
          />
          <div className="absolute -end-40 -top-28 h-96 w-96 rounded-full border border-[#4d6fe0]/20" />
          <Star4 className="absolute start-[9%] top-[10%] text-[#7ea6ff]/80" size={12} />
        </>
      )}
      <div
        className="absolute -bottom-28 -start-16 h-64 w-64 rounded-full"
        style={{
          background: 'radial-gradient(circle at 60% 30%, #1d2c80, #0a1240 70%)',
          boxShadow: '0 0 0 1px rgba(90,120,255,0.45), 0 -8px 30px rgba(80,110,255,0.3)',
        }}
      />
      <div className="absolute -bottom-40 -end-24 h-72 w-[26rem] rounded-[50%] border border-[#4d6fe0]/30" />
      <div className="absolute -bottom-52 -end-40 h-80 w-[30rem] rounded-[50%] border border-[#4d6fe0]/20" />
      <Star4 className="absolute bottom-[6%] end-[4%] text-[#8fb0ff]" size={22} />
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function VenuePage({ venue }: { venue: Venue }) {
  const { lang, t } = useLang()

  const title =
    venue === 'hall' ? t.conferenceHall :
    venue === 'small-theater' ? t.smallTheater :
    t.outdoorStage
  const subtitle =
    venue === 'hall' ? 'LECTURE HALL' :
    venue === 'small-theater' ? 'SMALL THEATER' :
    'OUTDOOR STAGE'

  const items = useMemo(() => scheduleByVenue(venue), [venue])

  const groups = useMemo(() => {
    const map = new Map<string, ScheduleItem[]>()
    for (const item of items) {
      map.set(item.date, [...(map.get(item.date) ?? []), item])
    }
    return [...map.entries()]
  }, [items])

  return (
    <div className="relative min-h-dvh overflow-hidden bg-space-950">
      <img src={bg} alt="" aria-hidden className="fixed inset-0 h-full w-full object-cover" />
      <div aria-hidden className="fixed inset-0 bg-gradient-to-b from-[#0a1040]/40 via-transparent to-[#0a1040]/50" />
      <Decor variant={venue} />

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-5 sm:px-8 sm:pt-7">
        <Link
          to="/map"
          className="mb-6 inline-flex items-center gap-2 text-sm text-[#b4c2ff] transition hover:text-white"
        >
          <span>{t.backToMap}</span>
        </Link>

        <header className="mb-8 text-center sm:mb-10">
          <div className="flex items-center justify-center gap-3 sm:gap-5">
            <h1
              className="text-4xl font-extrabold text-white sm:text-6xl"
              style={{ textShadow: '0 0 26px rgba(120,160,255,0.55)' }}
            >
              {title}
            </h1>
            <span className="scale-[.8] sm:scale-100">
              {venue === 'hall' ? <PlanetIcon /> :
               venue === 'small-theater' ? <SmallTheaterIcon /> :
               <PavilionIcon />}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-4" dir="ltr">
            <span className="flex items-center">
              <span className="h-1 w-1 rounded-full bg-[#5b8cff]" />
              <span className="h-px w-14 bg-gradient-to-r from-[#5b8cff] to-[#5b8cff]/30 sm:w-20" />
            </span>
            <span className="font-mono text-sm tracking-[0.4em] text-[#7fa2ff]">{subtitle}</span>
            <span className="flex items-center">
              <span className="h-px w-14 bg-gradient-to-l from-[#5b8cff] to-[#5b8cff]/30 sm:w-20" />
              <span className="h-1 w-1 rounded-full bg-[#5b8cff]" />
            </span>
          </div>
        </header>

        <div className="space-y-8">
          {groups.map(([date, list]) => (
            <section key={date} className="space-y-5">
              <h2 className="text-sm font-bold text-[#8fb0ff]">
                {lang === 'en' ? list[0].dayLabelEn : list[0].dayLabelAr}
              </h2>
              {list.map((item) =>
                venue === 'hall' ? (
                  <HallCard key={item.id} item={item} lang={lang} />
                ) : venue === 'small-theater' ? (
                  <SmallTheaterCard key={item.id} item={item} lang={lang} />
                ) : (
                  <StageCard key={item.id} item={item} lang={lang} />
                ),
              )}
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}