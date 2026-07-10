import { AlertTriangle, X, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { useAlertLevel } from "@/context/AlertLevelContext";
import { useEarthquake, useLatestEarthquake } from "@/context/EarthquakeContext";
import { useLatestVolcano } from "@/context/VolcanoContext";
import { formatKst } from "@/lib/format";
import { alertTextKey, type AlertLevelId } from "@/lib/alertLevels";
import { useI18n } from "@/i18n/I18nContext";

function LiveClock({ localeTag }: { localeTag: string }) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums">
      {time.toLocaleString(localeTag, {
        timeZone: "Asia/Seoul",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })}
    </span>
  );
}

export default function AlertBanner() {
  const [dismissed, setDismissed] = useState(false);
  const { level, manual, suggestedId, followSuggested } = useAlertLevel();
  const { loading: eqLoading, lastRefresh } = useEarthquake();
  const latestEq = useLatestEarthquake();
  const latestVol = useLatestVolcano();
  const { t, localeTag } = useI18n();

  if (dismissed) return null;

  const isLight = level.id === "caution";
  const name = t(alertTextKey(level.id, "name"));
  const bannerLine = t(alertTextKey(level.id, "bannerLine"));
  const citizenAction = t(alertTextKey(level.id, "citizenAction"));
  const suggestedName = t(alertTextKey(suggestedId as AlertLevelId, "name"));

  return (
    <div
      data-testid="alert-banner"
      className={`shadow-md ${level.bgClass} ${isLight ? "text-slate-900" : "text-white"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-2.5 px-4 py-2">
        <AlertTriangle
          className={`shrink-0 ${level.id === "serious" ? "animate-pulse" : ""}`}
          size={18}
          strokeWidth={2.5}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug">
            <span
              className={`mr-2 inline-block rounded-full px-2 py-0.5 text-xs font-black uppercase tracking-wider ${
                isLight ? "bg-slate-900 text-amber-300" : "bg-white/95 text-slate-900"
              }`}
            >
              {t("banner.crisis", { name })}
            </span>
            {bannerLine}
          </p>
          <p className={`mt-0.5 truncate text-xs sm:text-sm ${isLight ? "text-slate-900/85" : "text-white/90"}`}>
            {citizenAction}
            {manual && (
              <button
                type="button"
                onClick={followSuggested}
                className="ml-2 underline underline-offset-2 opacity-90 hover:opacity-100"
              >
                {t("banner.followSuggested", { name: suggestedName })}
              </button>
            )}
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <span
            className={`flex items-center gap-1.5 text-sm font-medium ${isLight ? "text-slate-800/70" : "text-white/80"}`}
          >
            <Activity size={12} className={eqLoading ? "animate-spin" : ""} />
            <LiveClock localeTag={localeTag} />
          </span>
          <button
            type="button"
            aria-label={t("common.close")}
            onClick={() => setDismissed(true)}
            className={isLight ? "text-slate-700 hover:text-black" : "text-white/70 hover:text-white"}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div
        className={`border-t px-4 py-1.5 ${isLight ? "border-black/10 bg-black/5" : "border-white/15 bg-black/15"}`}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 text-xs sm:flex-row sm:items-center sm:gap-6 sm:text-sm">
          <p className="min-w-0 truncate">
            <span className="mr-1.5 font-black opacity-80">{t("common.volcano")}</span>
            {latestVol
              ? t("banner.volLine", {
                  name: latestVol.volcanoName ?? "—",
                  km: latestVol.plumeHeightKm ?? "—",
                  time: formatKst(latestVol.announcedAt, undefined, localeTag),
                })
              : t("common.waiting")}
          </p>
          <p className="min-w-0 truncate">
            <span className="mr-1.5 font-black opacity-80">{t("common.earthquake")}</span>
            {latestEq
              ? t("banner.eqLine", {
                  mag: latestEq.magnitude.toFixed(1),
                  loc: latestEq.location,
                })
              : t("common.waiting")}
            {lastRefresh && (
              <span className="ml-2 opacity-60">
                {t("banner.refreshed", {
                  time: lastRefresh.toLocaleTimeString(localeTag, {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  }),
                })}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
