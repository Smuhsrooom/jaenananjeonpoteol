import { Waves, RefreshCw, AlertTriangle } from "lucide-react";
import { useEarthquake } from "@/context/EarthquakeContext";
import { formatKst, magnitudeBg, magnitudeColor } from "@/lib/format";

export default function EarthquakeListSection() {
  const { data, loading, error, lastRefresh, refetch, source } = useEarthquake();

  const sourceLabel =
    source === "kma-apihub"
      ? "기상청 API허브 eqk_now"
      : source === "kma-eqk-info"
        ? "data.go.kr EqkInfoService"
        : source === "kma-weather-web"
          ? "날씨누리"
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
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Live · Earthquake
              </span>
            </div>
            <h2 className="text-xl font-black text-[#0B2B66] md:text-2xl">지진정보 목록</h2>
            <p className="mt-1 text-sm text-slate-600">
              {sourceLabel}
              {" · "}
              {loading ? "조회 중…" : `${data.length}건`}
              {lastRefresh
                ? ` · 갱신 ${lastRefresh.toLocaleTimeString("ko-KR")}`
                : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            새로고침
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 flex gap-3">
            <AlertTriangle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700">지진 API 오류</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {loading && data.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">지진정보 불러오는 중…</span>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <p className="py-16 text-center text-sm text-slate-500">표시할 지진정보가 없습니다.</p>
        )}

        {data.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((eq) => (
              <article
                key={`${eq.seq}-${eq.occurredAt}-${eq.lat}-${eq.lon}`}
                className={`rounded-2xl border p-4 bg-white shadow-sm ${magnitudeBg(eq.magnitude)}`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <span className="inline-block rounded bg-slate-800/10 px-2 py-0.5 text-[10px] font-bold text-slate-700 mb-1">
                      {eq.typeLabel}
                    </span>
                    <h3 className="font-bold text-sm text-slate-900 leading-snug">{eq.location}</h3>
                  </div>
                  <p className={`text-2xl font-black shrink-0 ${magnitudeColor(eq.magnitude)}`}>
                    M{eq.magnitude.toFixed(1)}
                  </p>
                </div>
                <dl className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px]">
                  <div>
                    <dt className="text-slate-400 font-bold">발생</dt>
                    <dd className="text-slate-700">{formatKst(eq.occurredAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-bold">발표</dt>
                    <dd className="text-slate-700">{formatKst(eq.announcedAt)}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-bold">좌표</dt>
                    <dd className="text-slate-700 font-mono">
                      {eq.lat}, {eq.lon}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-slate-400 font-bold">진도</dt>
                    <dd className="text-slate-700">{eq.intensity || "—"}</dd>
                  </div>
                </dl>
                {eq.remark && (
                  <p className="mt-2 text-[11px] text-slate-600 leading-relaxed border-t border-black/5 pt-2">
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
