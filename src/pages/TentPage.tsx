import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BoothInfoPanel from "../components/BoothInfoPanel";
import StarfieldBackdrop from "../components/StarfieldBackdrop";
import TentScene from "../components/TentScene";
import { fetchBoothsByZone, fetchZones } from "../lib/queries";
import { useLang } from "../lib/langContext";
import { tentImages } from "../lib/tentImages";
import { tentLayouts } from "../lib/tentLayouts";
import type { Booth, Zone } from "../lib/types";

export default function TentPage() {
  const { tentId: zoneCode } = useParams<{ tentId: string }>();
  const navigate = useNavigate();
  const { lang, t } = useLang();
  const [zone, setZone] = useState<Zone | null>(null);
  const [booths, setBooths] = useState<Booth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBooth, setSelectedBooth] = useState<Booth | null>(null);

  useEffect(() => {
    setSelectedBooth(null);

    if (!zoneCode) {
      setZone(null);
      setBooths([]);
      setError("Unknown tent");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    if (!zoneCode) return;
    Promise.all([fetchZones(), fetchBoothsByZone(zoneCode)])
      .then(([zones, boothList]) => {
        const foundZone = zones.find((z) => z.zone_code === zoneCode) ?? null;
        setZone(foundZone);
        setBooths(boothList.map((b) => ({ ...b, zone: foundZone }) as any));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [zoneCode]);

  const layout = zoneCode ? tentLayouts[zoneCode] : undefined;
  const zoneName = zone ? (lang === "en" ? zone.name_en : zone.name_ar) : null;

  return (
    <div className="relative min-h-screen bg-space-950 overflow-x-clip">
      <StarfieldBackdrop />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 pt-5 pb-16">
        {/* ── Row 1: booth-count badge + back button ── */}
        <div className="flex items-center justify-between mb-5">
          {booths.length > 0 ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-hairline bg-surface/70 backdrop-blur-sm text-sm font-mono">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#f2c572">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
              <span className="text-star">{t.boothCount(booths.length)}</span>
            </div>
          ) : (
            <span />
          )}

          <button
            onClick={() => navigate("/map")}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-hairline bg-surface/70 backdrop-blur-sm text-sm text-ink-dim hover:text-ink hover:border-comet transition"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            <span>{lang === "ar" ? "العودة إلى الخريطة" : "Back to Map"}</span>
          </button>
        </div>

        {/* ── Row 2: tent name + subtitle ── */}
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink leading-tight">
            {zoneName ?? (loading ? "..." : "")}
          </h1>
          <p className="text-xs text-ink-faint mt-1">{t.tentSubtitle}</p>
        </div>

        {loading && <p className="text-ink-dim">{t.loadingBooths}</p>}
        {error && (
          <p className="text-red-400">
            {t.errorBooths}: {error}
          </p>
        )}

        {/* ── 3-D scene ── */}
        {!loading && !error && layout && (
          <div
            dir="ltr"
            className="relative w-full rounded-2xl overflow-hidden tent-scene-wrapper"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 rounded-2xl"
              style={{
                border: "1px solid rgba(42,52,83,0.55)",
                boxShadow: "inset 0 0 40px rgba(9,12,22,0.45)",
              }}
            />
            <TentScene
              layout={layout}
              booths={booths}
              imageUrl={zoneCode ? tentImages[zoneCode] : undefined}
              selectedBoothNumber={selectedBooth?.booth_number ?? null}
              onSelectBooth={setSelectedBooth}
            />
          </div>
        )}

        {!loading && !error && !layout && (
          <p className="text-ink-dim">{t.noLayout}</p>
        )}
      </div>

      <BoothInfoPanel
        booth={selectedBooth}
        onClose={() => setSelectedBooth(null)}
      />
    </div>
  );
}
