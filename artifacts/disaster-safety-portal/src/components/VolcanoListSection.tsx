import { useState } from "react";
import {
  Mountain,
  RefreshCw,
  AlertTriangle,
  MapPin,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useVolcano, type VolcanoEvent } from "@/context/VolcanoContext";
import { formatKst } from "@/lib/format";
import { useI18n } from "@/i18n/I18nContext";

const PREVIEW_COUNT = 8;

function VolcanoRow({
  item,
  expanded,
  onToggle,
  t,
  localeTag,
}: {
  item: VolcanoEvent;
  expanded: boolean;
  onToggle: () => void;
  t: (k: string, v?: Record<string, string | number>) => string;
  localeTag: string;
}) {
  return (
    <article className="border-b border-slate-100 bg-white last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-slate-50/90"
        aria-expanded={expanded}
      >
        <span className="shrink-0 rounded bg-orange-100 px-2 py-0.5 text-sm font-bold text-orange-800">
          {item.alertLevel || t("volList.info")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-slate-900">
            {item.volcanoName || item.title}
          </p>
          <p className="mt-0.5 truncate text-sm text-slate-500">
            {item.location || t("volList.locationUnknown")}
            {" · "}
            {formatKst(item.eruptedAt || item.announcedAt, undefined, localeTag)}
            {item.plumeHeightKm != null
              ? ` · ${t("volList.plumeKm", { n: item.plumeHeightKm })}`
              : ""}
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-[#0F3D91]">
          {expanded ? t("common.collapse") : t("common.more")}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 bg-[#f8fafc] px-4 py-4">
          <div className="mb-3 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <Detail label={t("volList.detailType")} value={item.alertLevel} />
            <Detail label={t("volList.detailName")} value={item.volcanoName} />
            <Detail label={t("volList.detailLoc")} value={item.location} />
            <Detail
              label={t("volList.detailAnnounced")}
              value={formatKst(item.announcedAt, undefined, localeTag)}
            />
            <Detail
              label={t("volList.detailErupted")}
              value={formatKst(item.eruptedAt, undefined, localeTag)}
            />
            <Detail
              label={t("volList.detailPlume")}
              value={item.plumeHeightKm != null ? `${item.plumeHeightKm} km` : null}
            />
            <Detail
              label={t("volList.detailCoord")}
              value={
                item.lat != null && item.lon != null
                  ? `${item.lat}°N, ${item.lon}°E`
                  : null
              }
            />
            <Detail label={t("volList.detailTitle")} value={item.title} />
          </div>

          {item.message && (
            <div className="mb-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5">
              <p className="mb-1 text-sm font-bold uppercase tracking-wide text-slate-400">
                {t("volList.message")}
              </p>
              <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">
                {item.message}
              </p>
            </div>
          )}

          {Object.keys(item.raw).length > 0 && (
            <details className="group">
              <summary className="flex list-none cursor-pointer items-center gap-1 text-sm font-semibold text-slate-500 hover:text-[#0F3D91]">
                <ChevronDown size={12} className="transition-transform group-open:rotate-180" />
                {t("volList.rawFields", { n: Object.keys(item.raw).length })}
              </summary>
              <dl className="mt-2 grid gap-x-4 gap-y-1.5 rounded-lg border border-slate-200 bg-white p-3 text-sm sm:grid-cols-2">
                {Object.entries(item.raw).map(([k, v]) => (
                  <div key={k} className="min-w-0 border-b border-slate-50 pb-1 last:border-0">
                    <dt className="font-mono text-slate-400">{k}</dt>
                    <dd className="whitespace-pre-wrap break-words text-slate-800">{v}</dd>
                  </div>
                ))}
              </dl>
            </details>
          )}
        </div>
      )}
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2">
      <p className="text-sm font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 break-words font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}

export default function VolcanoListSection() {
  const { data, loading, error, needsApplication, lastRefresh, refetch, source } = useVolcano();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);
  const { t, localeTag } = useI18n();

  const visible = showAll ? data : data.slice(0, PREVIEW_COUNT);
  const hiddenCount = Math.max(0, data.length - PREVIEW_COUNT);

  const toggle = (id: string) => {
    setExpandedId((cur) => (cur === id ? null : id));
  };

  return (
    <section id="volcano" className="border-b border-slate-200 bg-white py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-orange-600 p-2">
                <Mountain size={16} className="text-white" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Live · Volcano
              </span>
            </div>
            <h2 className="text-xl font-black text-[#0B2B66] md:text-2xl">{t("volList.title")}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {t("volList.subtitle")}
              {" · "}
              {loading ? t("eqList.querying") : t("common.count", { n: data.length })}
              {source ? ` · ${source}` : ""}
              {lastRefresh
                ? ` · ${t("common.updated")} ${lastRefresh.toLocaleTimeString(localeTag)}`
                : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            {t("common.refresh")}
          </button>
        </div>

        {error && (
          <div className="mb-4 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
            <AlertTriangle size={16} className="mt-0.5 shrink-0 text-red-600" />
            <div>
              <p className="text-sm font-semibold text-red-700">{t("volList.error")}</p>
              <p className="mt-0.5 text-sm text-red-600">{error}</p>
              {needsApplication && (
                <p className="mt-1 text-sm text-red-500">{t("volList.needsApp")}</p>
              )}
            </div>
          </div>
        )}

        {loading && data.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">{t("volList.loading")}</span>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <p className="py-16 text-center text-sm text-slate-500">{t("volList.empty")}</p>
        )}

        {data.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div className="hidden items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold uppercase tracking-wide text-slate-400 sm:flex">
              <span className="w-14">{t("volList.colType")}</span>
              <span className="flex-1">{t("volList.colSummary")}</span>
              <span className="w-24 text-right">{t("volList.colDetail")}</span>
            </div>

            {visible.map((v) => (
              <VolcanoRow
                key={v.id}
                item={v}
                expanded={expandedId === v.id}
                onToggle={() => toggle(v.id)}
                t={t}
                localeTag={localeTag}
              />
            ))}

            {hiddenCount > 0 && (
              <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0F3D91] hover:underline"
                >
                  {showAll ? (
                    <>
                      {t("volList.showLess")}
                      <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      {t("volList.showAll", { n: hiddenCount })}
                      <ChevronDown size={14} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {data.length > 0 && (
          <p className="mt-3 flex items-center gap-1 text-sm text-slate-400">
            <MapPin size={11} />
            {t("volList.tip")}
          </p>
        )}
      </div>
    </section>
  );
}
