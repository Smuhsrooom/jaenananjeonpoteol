import { useEffect, useState } from "react";
import { AlertTriangle, Activity } from "lucide-react";
import { useAlertLevel } from "@/context/AlertLevelContext";
import { useEarthquake, useLatestEarthquake } from "@/context/EarthquakeContext";
import { useLatestVolcano } from "@/context/VolcanoContext";
import { alertTextKey, type AlertLevelId } from "@/lib/alertLevels";
import { formatKst } from "@/lib/format";
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

/**
 * 상단 단일 경보 바 — 단계 문구 + 국민 행동 + 실시간 관측 (중복 제거)
 */
export default function CrisisThemeBar() {
  const { level, manual, suggestedId, followSuggested, openSeriousModal } = useAlertLevel();
  const { loading: eqLoading, lastRefresh } = useEarthquake();
  const latestEq = useLatestEarthquake();
  const latestVol = useLatestVolcano();
  const { t, localeTag } = useI18n();

  const isLight = level.id === "caution";
  const fg = isLight ? "#1a1a1a" : "#ffffff";
  const name = t(alertTextKey(level.id, "name"));
  const nameEn = t(alertTextKey(level.id, "nameEn"));
  const line = t(alertTextKey(level.id, "bannerLine"));
  const citizenAction = t(alertTextKey(level.id, "citizenAction"));
  const suggestedName = t(alertTextKey(suggestedId as AlertLevelId, "name"));

  return (
    <div
      data-testid="alert-banner"
      className="border-b transition-colors duration-300"
      style={{
        backgroundColor: level.color,
        borderBottomColor: level.inkColor,
        color: fg,
      }}
      role="status"
      aria-live="polite"
    >
      {/* 1행: 단계 + 경고 문구 */}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-2 gap-y-1 px-4 py-2 sm:px-6">
        <AlertTriangle
          size={16}
          className={`shrink-0 ${level.id === "serious" ? "animate-pulse" : ""}`}
          strokeWidth={2.5}
        />
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-black uppercase tracking-wide"
          style={{
            backgroundColor: isLight ? "rgba(0,0,0,.14)" : "rgba(255,255,255,.92)",
            color: isLight ? fg : "#0f172a",
          }}
        >
          {name} · {nameEn}
        </span>
        <p className="min-w-0 flex-1 text-sm font-semibold leading-snug">{line}</p>
        {level.id === "serious" && (
          <button
            type="button"
            onClick={openSeriousModal}
            className="shrink-0 rounded-lg bg-white px-2.5 py-1 text-xs font-bold text-red-800 shadow-sm hover:bg-red-50"
          >
            {t("seriousModal.openCta")}
          </button>
        )}
      </div>

      {/* 2행: 국민 행동 (짧게) + 관측 요약 — 경보 문구 반복 없음 */}
      <div
        className="border-t px-4 py-1.5 sm:px-6"
        style={{
          borderTopColor: isLight ? "rgba(0,0,0,.1)" : "rgba(255,255,255,.18)",
          backgroundColor: isLight ? "rgba(0,0,0,.06)" : "rgba(0,0,0,.12)",
        }}
      >
        <div className="mx-auto flex max-w-7xl flex-col gap-1 text-[11px] sm:flex-row sm:items-center sm:gap-4 sm:text-xs">
          <p className="min-w-0 shrink-0 font-semibold opacity-95 sm:max-w-[40%]">
            <span className="opacity-80">{t("banner.actionLabel")} </span>
            {citizenAction}
            {manual && (
              <button
                type="button"
                onClick={followSuggested}
                className="ml-1.5 underline underline-offset-2 opacity-90 hover:opacity-100"
              >
                {t("banner.followSuggested", { name: suggestedName })}
              </button>
            )}
          </p>
          <span className="hidden opacity-40 sm:inline">|</span>
          <p className="min-w-0 truncate opacity-90">
            <span className="font-bold opacity-80">{t("common.volcano")} </span>
            {latestVol
              ? t("banner.volLine", {
                  name: latestVol.volcanoName ?? "—",
                  km: latestVol.plumeHeightKm ?? "—",
                  time: formatKst(latestVol.announcedAt, undefined, localeTag),
                })
              : t("common.waiting")}
          </p>
          <p className="min-w-0 truncate opacity-90">
            <span className="font-bold opacity-80">{t("common.earthquake")} </span>
            {latestEq
              ? t("banner.eqLine", {
                  mag: latestEq.magnitude.toFixed(1),
                  loc: latestEq.location,
                })
              : t("common.waiting")}
            {lastRefresh && (
              <span className="ml-1.5 opacity-70">
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
          <span className="ml-auto hidden items-center gap-1 opacity-80 sm:inline-flex">
            <Activity size={11} className={eqLoading ? "animate-spin" : ""} />
            <LiveClock localeTag={localeTag} />
          </span>
        </div>
      </div>
    </div>
  );
}
