import { AlertTriangle } from "lucide-react";
import VolcanoListSection from "@/components/VolcanoListSection";
import EarthquakeListSection from "@/components/EarthquakeListSection";

/** 실시간 관측 구역 — 교육 시나리오와 분리 */
export default function LiveSection() {
  return (
    <div id="live">
      <div className="border-b border-slate-100 bg-[#0B2B66] px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-blue-200/70">
            06 · Live observation
          </p>
          <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">
            기상청 실시간 관측
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-blue-100/90">
            기상청 API허브에서 수신한 <strong className="text-white">실제 발표</strong>입니다.
            목록에 해외 화산(예: 에트나)이 보여도 정상입니다.
          </p>
          <div className="mt-4 flex gap-3 rounded-xl border border-amber-300/40 bg-amber-500/15 px-4 py-3 text-amber-50">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-200" />
            <div className="text-xs leading-relaxed sm:text-[13px]">
              <p className="font-black text-amber-100">안내</p>
              <p className="mt-1 text-amber-50/95">
                기상청에 발표된 관측·통보를 그대로 표시합니다.{" "}
                <strong>백두산이 지금 분화 중</strong>이라는 뜻이 아닙니다. 공식 경보·대피는
                행정안전부·기상청·지자체 발표를 따르세요.
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white">
              화산 간략 → 자세히 보기
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white">
              지진 카드 목록
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-[10px] font-semibold text-white">
              출처: 기상청 API허브
            </span>
          </div>
        </div>
      </div>
      <VolcanoListSection />
      <EarthquakeListSection />
    </div>
  );
}
