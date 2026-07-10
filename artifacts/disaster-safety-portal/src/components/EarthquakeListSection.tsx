import { Waves, RefreshCw, AlertTriangle } from "lucide-react";
import { useEarthquake } from "@/context/EarthquakeContext";
import { formatKst, magnitudeBg, magnitudeColor } from "@/lib/format";
import { useI18n } from "@/i18n/I18nContext";

export default function EarthquakeListSection() {
  const { data, loading, error, lastRefresh, refetch, source } = useEarthquake();
  const { t, localeTag } = useI18n();

  const sourceLabel =
    source === "kma-apihub"
      ? t("eqList.sourceHub")
      : source === "kma-eqk-info"
        ? t("eqList.sourceGo")
        : source === "kma-weather-web"
          ? t("eqList.sourceWeb")
          : source ?? "API";

  return (
    <section id="earthquake" className="border-b border-slate-200 bg-[#FAFBFC] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded-lg bg-[#0B2B66] p-2">
                <Waves size={16} className="text-white" />
              </div>
              <span className="text-sm font-bold uppercase tracking-widest text-slate-400">
                Live · Earthquake
              </span>
            </div>
            <h2 className="text-xl font-black text-[#0B2B66] md:text-2xl">{t("eqList.title")}</h2>
            <p className="mt-1 text-sm text-slate-600">
              {sourceLabel}
              {" · "}
              {loading ? t("eqList.querying") : t("common.count", { n: data.length })}
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
              <p className="text-sm font-semibold text-red-700">{t("eqList.error")}</p>
              <p className="mt-0.5 text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {loading && data.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">{t("eqList.loading")}</span>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <p className="py-16 text-center text-sm text-slate-500">{t("eqList.empty")}</p>
        )}

        {data.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((eq) => (
              <article
                key={`${eq.seq}-${eq.occurredAt}-${eq.lat}-${eq.lon}`}
                className={`rounded-2xl border bg-white p-4 shadow-sm ${magnitudeBg(eq.magnitude)}`}
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="mb-1 inline-block rounded bg-slate-800/10 px-2 py-0.5 text-sm font-bold text-slate-700">
                      {eq.typeLabel}
                    </span>
                    <h3 className="text-sm font-bold leading-snug text-slate-900">{eq.location}</h3>
                  </div>
                  <p className={`shrink-0 text-2xl font-black ${magnitudeColor(eq.magnitude)}`}>
                    M{eq.magnitude.toFixed(1)}
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-sm">
                  <div>
                    <dt className="font-bold text-slate-400">{t("eqList.occurred")}</dt>
                    <dd className="text-slate-700">
                      {formatKst(eq.occurredAt, undefined, localeTag)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-slate-400">{t("eqList.announced")}</dt>
                    <dd className="text-slate-700">
                      {formatKst(eq.announcedAt, undefined, localeTag)}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-slate-400">{t("eqList.coords")}</dt>
                    <dd className="font-mono text-slate-700">
                      {eq.lat}, {eq.lon}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold text-slate-400">{t("eqList.intensity")}</dt>
                    <dd className="text-slate-700">{eq.intensity || "—"}</dd>
                  </div>
                </dl>
                {eq.remark && (
                  <p className="mt-2 border-t border-black/5 pt-2 text-base leading-relaxed text-slate-700">
                    {eq.remark}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
