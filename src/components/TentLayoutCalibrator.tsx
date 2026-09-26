// ⚠️ DEV-ONLY — أداة معايرة مواضع الأكشاك على صور الخيام الجديدة.
// بعد ما تخلصي، شيلي الراوت المؤقت (الأداة بتعرض رسالة في build الإنتاج).
// الاستخدام: اختاري الخيمة → اضغطي على مكان كل كشك (الرقم بيزيد لوحده)
// → اسحبي أي ماركر لتحريكه → دبل-كليك للحذف → انسخي الكود المتولد.
import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as RPointerEvent } from 'react'
import { tentImages } from '../lib/tentImages'
import { tentLayouts } from '../lib/tentLayouts'

interface Marker {
  number: number
  xPct: number
  zPct: number
}

const ZONES = [
  { code: 'gateway_to_universe', label: 'بوابة الكون (أكشاك 2–13)', start: 2 },
  { code: 'sky_observatory', label: 'مرصد السماء (أكشاك 14–24)', start: 14 },
  { code: 'big_bang', label: 'الانفجار العظيم (أكشاك 25–35)', start: 25 },
  { code: 'planetarium_academy', label: 'أكاديمية القبة (كشك 36)', start: 36 },
]

const round1 = (n: number) => Math.round(n * 10) / 10

export default function TentLayoutCalibrator() {
  const [zoneCode, setZoneCode] = useState(ZONES[0].code)
  const zone = ZONES.find((z) => z.code === zoneCode)!
  const [markers, setMarkers] = useState<Marker[]>([])
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [hover, setHover] = useState<{ x: number; z: number } | null>(null)
  const [copied, setCopied] = useState(false)
  const [dims, setDims] = useState<{ w: number; h: number } | null>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  // ابدأ من اللي إحفظ في tentLayouts عشان تزحزح بدل ما تعيد من الصفر
  useEffect(() => {
    setMarkers((tentLayouts[zoneCode]?.markers ?? []).map((m) => ({ ...m })))
    setDims(null)
  }, [zoneCode])

  const nextNumber = markers.length
    ? Math.max(...markers.map((m) => m.number)) + 1
    : zone.start

  const pctFromEvent = (e: RPointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current!.getBoundingClientRect()
    return {
      xPct: Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100)),
      zPct: Math.min(100, Math.max(0, ((e.clientY - rect.top) / rect.height) * 100)),
    }
  }

  // ضغطة على الصورة = إضافة كشك جديد بالرقم التالي
  const onStagePointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    const { xPct, zPct } = pctFromEvent(e)
    setMarkers((ms) => [...ms, { number: nextNumber, xPct: round1(xPct), zPct: round1(zPct) }])
  }

  const onStagePointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    const p = pctFromEvent(e)
    setHover({ x: round1(p.xPct), z: round1(p.zPct) })
    if (dragIdx !== null) {
      setMarkers((ms) =>
        ms.map((m, i) => (i === dragIdx ? { ...m, xPct: round1(p.xPct), zPct: round1(p.zPct) } : m)),
      )
    }
  }

  const sorted = [...markers].sort((a, b) => a.number - b.number)
  const generated = `// ${zone.label}
 ${zoneCode}: {
  markers: [
 ${sorted.map((m) => `    { number: ${m.number}, xPct: ${round1(m.xPct)}, zPct: ${round1(m.zPct)} },`).join('\n')}
  ],
},`

  const copy = async () => {
    await navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }

  const aspect = dims ? dims.w / dims.h : null
  const aspectMatchesOld = aspect ? Math.abs(aspect - 1400 / 822) < 0.02 : null

  if (!import.meta.env.DEV) {
    return <div className="p-8 text-center text-ink-dim">أداة التطوير مش متاحة في نسخة الإنتاج</div>
  }

  return (
    <div dir="rtl" className="min-h-screen bg-space-950 text-white p-6 space-y-4">
      <div>
        <h1 className="text-xl font-bold">معايرة مواضع الأكشاك</h1>
        <p className="text-xs text-ink-dim mt-1">
          اضغطي على مكان كل كشك في الصورة (الرقم التالي: <span className="font-mono text-comet">{nextNumber}</span>) •
          اسحبي الماركر لتحريكه • دبل-كليك = حذف
        </p>
      </div>

      {/* اختيار الخيمة */}
      <div className="flex flex-wrap gap-2">
        {ZONES.map((z) => (
          <button
            key={z.code}
            onClick={() => setZoneCode(z.code)}
            className={`px-3 py-1.5 rounded-full text-sm border transition ${
              z.code === zoneCode
                ? 'bg-comet/20 border-comet text-comet'
                : 'border-white/20 text-ink-dim hover:border-white/40'
            }`}
          >
            {z.label}
          </button>
        ))}
      </div>

      {/* أدوات */}
      <div className="flex flex-wrap items-center gap-3 text-sm">
        <button
          onClick={() => setMarkers((tentLayouts[zoneCode]?.markers ?? []).map((m) => ({ ...m })))}
          className="px-3 py-1.5 rounded-lg border border-white/20 hover:border-white/40"
        >
          رجوع للافتراضي
        </button>
        <button onClick={() => setMarkers([])} className="px-3 py-1.5 rounded-lg border border-white/20 hover:border-white/40">
          مسح الكل
        </button>
        <span className="font-mono text-xs text-ink-dim">
          {hover ? `x: ${hover.x}% · z: ${hover.z}%` : '—'}
        </span>
        {dims && (
          <span className={`font-mono text-xs ${aspectMatchesOld ? 'text-emerald-400' : 'text-amber-400'}`}>
            {dims.w}×{dims.h} (aspect {round1(aspect!)}
            {aspectMatchesOld ? ' ✓ مطابق' : ' ⚠ مختلف عن 1400/822 — ابعتيلي الرقم ده'})
          </span>
        )}
      </div>

      {/* الصورة + الماركرز */}
      <div
        ref={stageRef}
        onPointerDown={onStagePointerDown}
        onPointerMove={onStagePointerMove}
        onPointerUp={() => setDragIdx(null)}
        onPointerLeave={() => {
          setDragIdx(null)
          setHover(null)
        }}
        className="relative w-full max-w-[900px] mx-auto rounded-xl overflow-hidden border border-white/20"
        style={{ touchAction: 'none', cursor: 'crosshair' }}
      >
        <img
          src={tentImages[zoneCode]}
          alt={zone.label}
          draggable={false}
          className="block w-full h-auto select-none pointer-events-none"
          onLoad={(e) =>
            setDims({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
          }
        />

        {/* شبكة كل 10% */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.18) 1px, transparent 1px)',
            backgroundSize: '10% 10%',
          }}
        />

        {markers.map((m, i) => (
          <div
            key={`${m.number}-${i}`}
            onPointerDown={(e) => {
              e.stopPropagation()
              setDragIdx(i)
              stageRef.current?.setPointerCapture(e.pointerId)
            }}
            onDoubleClick={() => setMarkers((ms) => ms.filter((_, j) => j !== i))}
            style={{ left: `${m.xPct}%`, top: `${m.zPct}%` }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full
              flex items-center justify-center font-mono font-bold text-sm cursor-grab
              active:cursor-grabbing select-none"
            title={`كشك ${m.number} — اسحبي للتحريك، دبل-كليك للحذف`}
            {...({
              style: {
                left: `${m.xPct}%`,
                top: `${m.zPct}%`,
                background: 'linear-gradient(160deg, #f9d98c, #d3a24a)',
                border: '2px solid #ffe3a1',
                color: '#2a1a04',
                boxShadow: '0 0 14px rgba(242,197,114,0.8)',
              },
            } as any)}
          >
            {m.number}
          </div>
        ))}
      </div>

      {/* الكود المتولد */}
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-ink-dim">الكود المتولد — انسخيه في tentLayouts.ts:</span>
          <button
            onClick={copy}
            className="px-3 py-1 rounded-lg text-xs bg-comet/20 border border-comet text-comet"
          >
            {copied ? 'تم النسخ ✓' : 'نسخ'}
          </button>
        </div>
        <pre dir="ltr" className="text-xs font-mono p-4 rounded-xl bg-space-900 border border-white/10 overflow-x-auto">
          {generated}
        </pre>
      </div>
    </div>
  )
}