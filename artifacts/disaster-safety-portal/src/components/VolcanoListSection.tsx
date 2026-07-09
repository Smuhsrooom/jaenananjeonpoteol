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

/** 기본으로 간략 표시할 개수 */
const PREVIEW_COUNT = 8;

function VolcanoRow({
  item,
  expanded,
  onToggle,
}: {
  item: VolcanoEvent;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className="border-b border-slate-100 last:border-b-0 bg-white">
      {/* 간략 행 */}
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50/90 transition-colors"
        aria-expanded={expanded}
      >
        <span className="shrink-0 rounded bg-orange-100 px-2 py-0.5 text-[10px] font-bold text-orange-800">
          {item.alertLevel || "정보"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-slate-900 truncate">
            {item.volcanoName || item.title}
          </p>
          <p className="text-[11px] text-slate-500 truncate mt-0.5">
            {item.location || "위치 미상"}
            {" · "}
            {formatKst(item.eruptedAt || item.announcedAt)}
            {item.plumeHeightKm != null ? ` · 분연주 ${item.plumeHeightKm} km` : ""}
          </p>
        </div>
        <span className="shrink-0 flex items-center gap-1 text-[11px] font-semibold text-[#0F3D91]">
          {expanded ? "접기" : "자세히 보기"}
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </span>
      </button>

      {/* 상세 패널 */}
      {expanded && (
        <div className="border-t border-slate-100 bg-[#f8fafc] px-4 py-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs mb-3">
            <Detail label="통보 종류" value={item.alertLevel} />
            <Detail label="화산명" value={item.volcanoName} />
            <Detail label="위치" value={item.location} />
            <Detail label="발표시각" value={formatKst(item.announcedAt)} />
            <Detail label="분화시각" value={formatKst(item.eruptedAt)} />
            <Detail
              label="분연주 높이"
              value={item.plumeHeightKm != null ? `${item.plumeHeightKm} km` : null}
            />
            <Detail
              label="위도 / 경도"
              value={
                item.lat != null && item.lon != null
                  ? `${item.lat}°N, ${item.lon}°E`
                  : null
              }
            />
            <Detail label="제목" value={item.title} />
          </div>

          {item.message && (
            <div className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 mb-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400 mb-1">
                참고 / 당부
              </p>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {item.message}
              </p>
            </div>
          )}

          {/* raw 필드 전체 */}
          {Object.keys(item.raw).length > 0 && (
            <details className="group">
              <summary className="cursor-pointer text-[11px] font-semibold text-slate-500 hover:text-[#0F3D91] list-none flex items-center gap-1">
                <ChevronDown size={12} className="group-open:rotate-180 transition-transform" />
                원본 필드 전체 보기 ({Object.keys(item.raw).length})
              </summary>
              <dl className="mt-2 grid sm:grid-cols-2 gap-x-4 gap-y-1.5 rounded-lg border border-slate-200 bg-white p-3 text-[11px]">
                {Object.entries(item.raw).map(([k, v]) => (
                  <div key={k} className="min-w-0 border-b border-slate-50 pb-1 last:border-0">
                    <dt className="font-mono text-slate-400">{k}</dt>
                    <dd className="text-slate-800 break-words whitespace-pre-wrap">{v}</dd>
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
      <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 font-medium text-slate-800 break-words">{value || "—"}</p>
    </div>
  );
}

export default function VolcanoListSection() {
  const { data, loading, error, needsApplication, lastRefresh, refetch, source } = useVolcano();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(false);

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
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Live · Volcano
              </span>
            </div>
            <h2 className="text-xl font-black text-[#0B2B66] md:text-2xl">화산정보</h2>
            <p className="mt-1 text-sm text-slate-600">
              간략 목록 · 자세히 보기로 상세 펼침
              {" · "}
              {loading ? "조회 중…" : `${data.length}건`}
              {source ? ` · ${source}` : ""}
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
              <p className="text-sm font-semibold text-red-700">화산 API 오류</p>
              <p className="text-xs text-red-600 mt-0.5">{error}</p>
              {needsApplication && (
                <p className="text-xs text-red-500 mt-1">
                  API허브에서 해당 API 활용신청이 필요합니다.
                </p>
              )}
            </div>
          </div>
        )}

        {loading && data.length === 0 && (
          <div className="flex items-center justify-center gap-2 py-16 text-slate-400">
            <RefreshCw size={16} className="animate-spin" />
            <span className="text-sm">화산정보 불러오는 중…</span>
          </div>
        )}

        {!loading && !error && data.length === 0 && (
          <p className="py-16 text-center text-sm text-slate-500">표시할 화산정보가 없습니다.</p>
        )}

        {data.length > 0 && (
          <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            {/* 헤더 라인 */}
            <div className="hidden sm:flex items-center gap-3 border-b border-slate-200 bg-slate-50 px-4 py-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
              <span className="w-14">종류</span>
              <span className="flex-1">화산 · 위치 · 시각 · 분연주</span>
              <span className="w-24 text-right">상세</span>
            </div>

            {visible.map((v) => (
              <VolcanoRow
                key={v.id}
                item={v}
                expanded={expandedId === v.id}
                onToggle={() => toggle(v.id)}
              />
            ))}

            {hiddenCount > 0 && (
              <div className="border-t border-slate-100 bg-slate-50 px-4 py-3 text-center">
                <button
                  type="button"
                  onClick={() => setShowAll((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F3D91] hover:underline"
                >
                  {showAll ? (
                    <>
                      간략히 보기
                      <ChevronUp size={14} />
                    </>
                  ) : (
                    <>
                      나머지 {hiddenCount}건 더 보기
                      <ChevronDown size={14} />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {data.length > 0 && (
          <p className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
            <MapPin size={11} />
            행을 누르면 좌표·참고문·원본 필드까지 펼쳐집니다.
          </p>
        )}
      </div>
    </section>
  );
}
