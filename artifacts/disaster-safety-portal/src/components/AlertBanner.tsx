import { AlertTriangle, X, Activity } from "lucide-react";
import { useState, useEffect } from "react";
import { useAlertLevel } from "@/context/AlertLevelContext";
import { useEarthquake, useLatestEarthquake } from "@/context/EarthquakeContext";
import { useLatestVolcano } from "@/context/VolcanoContext";
import { formatKst } from "@/lib/format";

function LiveClock() {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums">
      {time.toLocaleString("ko-KR", {
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

  if (dismissed) return null;

  const isLight = level.id === "caution"; // yellow needs dark text

  return (
    <div
      data-testid="alert-banner"
      className={`shadow-md ${level.bgClass} ${isLight ? "text-slate-900" : "text-white"}`}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2.5">
        <AlertTriangle
          className={`shrink-0 ${level.id === "serious" ? "animate-pulse" : ""}`}
          size={18}
          strokeWidth={2.5}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-snug">
            <span
              className={`mr-2 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                isLight ? "bg-slate-900 text-amber-300" : "bg-white/95 text-slate-900"
              }`}
            >
              위기경보 {level.nameKo}
            </span>
            {level.bannerLine}
          </p>
          <p className={`mt-0.5 truncate text-[11px] ${isLight ? "text-slate-800/80" : "text-white/85"}`}>
            {level.citizenAction}
            {manual && (
              <button
                type="button"
                onClick={followSuggested}
                className="ml-2 underline underline-offset-2 opacity-90 hover:opacity-100"
              >
                관측 제안({suggestedId === "interest" ? "관심" : suggestedId === "caution" ? "주의" : suggestedId === "alert" ? "경계" : "심각"})으로
              </button>
            )}
          </p>
        </div>
        <div className="hidden shrink-0 items-center gap-3 sm:flex">
          <span className={`flex items-center gap-1.5 text-xs font-medium ${isLight ? "text-slate-800/70" : "text-white/80"}`}>
            <Activity size={12} className={eqLoading ? "animate-spin" : ""} />
            <LiveClock />
          </span>
          <button
            type="button"
            aria-label="닫기"
            onClick={() => setDismissed(true)}
            className={isLight ? "text-slate-700 hover:text-black" : "text-white/70 hover:text-white"}
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* 실데이터 한 줄 */}
      <div className={`border-t px-4 py-1.5 ${isLight ? "border-black/10 bg-black/5" : "border-white/15 bg-black/15"}`}>
        <div className="mx-auto flex max-w-7xl flex-col gap-1 text-[11px] sm:flex-row sm:items-center sm:gap-6">
          <p className="min-w-0 truncate">
            <span className="mr-1.5 font-black opacity-80">화산</span>
            {latestVol
              ? `${latestVol.volcanoName ?? "—"} · 분연주 ${latestVol.plumeHeightKm ?? "—"}km · ${formatKst(latestVol.announcedAt)}`
              : "발표 대기"}
          </p>
          <p className="min-w-0 truncate">
            <span className="mr-1.5 font-black opacity-80">지진</span>
            {latestEq
              ? `M${latestEq.magnitude.toFixed(1)} · ${latestEq.location}`
              : "발표 대기"}
            {lastRefresh && (
              <span className="ml-2 opacity-60">
                갱신 {lastRefresh.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
