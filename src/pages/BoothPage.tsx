import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { fetchBooth } from '../lib/queries'
import { useLang } from '../lib/langContext'
import type { Booth } from '../lib/types'

export default function BoothPage() {
  const { boothId } = useParams<{ boothId: string }>()
  const navigate = useNavigate()
  const { lang, t } = useLang()
  const [booth, setBooth] = useState<Booth | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!boothId) return
    setLoading(true)
    fetchBooth(Number(boothId))
      .then(setBooth)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [boothId])

  const activities = booth?.activities ?? []

  const instName = (a: typeof activities[0]) =>
    lang === 'en' ? (a.institution_en ?? a.institution_ar ?? '—') : (a.institution_ar ?? a.institution_en ?? '—')

  const description = (a: typeof activities[0]) =>
    lang === 'en' ? (a.description_en ?? a.description_ar ?? '') : (a.description_ar ?? a.description_en ?? '')

  const typeLabel = (a: typeof activities[0]) => {
    if (!a.activity_type_en) return a.activity_type_ar ?? ''
    return (t as any)[a.activity_type_en] ?? (lang === 'ar' ? a.activity_type_ar : a.activity_type_en) ?? ''
  }

  const zoneName = booth?.zone
    ? (lang === 'en' ? booth.zone.name_en : booth.zone.name_ar)
    : ''

  return (
    <div className="min-h-screen px-4 py-10 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-ink-dim hover:text-comet transition mb-6"
        >
          {t.backToTent}
        </button>

        {loading && <p className="text-ink-dim">{t.loadingBooth}</p>}
        {error && <p className="text-red-400">{t.errorBooth}: {error}</p>}

        {booth && (
          <>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-star text-2xl">
                {booth.booth_number ?? '—'}
              </span>
              {zoneName && (
                <span className="text-xs text-ink-faint">{zoneName}</span>
              )}
            </div>

            {activities.length === 0 && (
              <p className="text-ink-dim mt-6">{t.noActivities}</p>
            )}

            <div className="mt-6 space-y-6">
              {activities.map((activity) => (
                <article
                  key={activity.activity_id}
                  className="rounded-xl border border-hairline bg-surface p-5"
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <h2 className="text-lg font-semibold text-ink">
                      {instName(activity)}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {activity.activity_type_en && (
                      <span className="text-xs rounded-full border border-nebula/50 text-nebula px-3 py-1">
                        {typeLabel(activity)}
                      </span>
                    )}
                    {activity.activity_dates && (
                      <span className="text-xs rounded-full border border-hairline text-ink-dim px-3 py-1">
                        {activity.activity_dates}
                      </span>
                    )}
                  </div>

                  {description(activity) && (
                    <p className="text-ink-dim leading-relaxed">
                      {description(activity)}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
