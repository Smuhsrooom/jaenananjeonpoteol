import SectionHeader from "@/components/SectionHeader";
import SourceStamp from "@/components/SourceStamp";
import { Check, X } from "lucide-react";

const GUIDES = [
  {
    where: "실내",
    who: "모든 시민",
    when: "화산재 낙하·경보 시",
    what: "창문·문을 닫고 틈새를 젖은 수건·테이프로 막기. 가급적 외출 자제.",
  },
  {
    where: "외출 시",
    who: "부득이 외출하는 사람",
    when: "실외 이동이 필요할 때",
    what: "보건용 마스크·긴소매 착용. 콘택트렌즈 대신 안경(화산재가 눈을 자극할 수 있음).",
  },
  {
    where: "건물·차량",
    who: "건물 관리자·운전자",
    when: "화산재가 쌓일 때",
    what: "쌓인 재 치우기(무게로 지붕 붕괴 위험). 차량 운행 자제(엔진·시야·미끄러움).",
  },
  {
    where: "평소 준비",
    who: "가정·학교",
    when: "평상시·관심·주의 단계",
    what: "물, 비상식량, 상비약, 보건용 마스크, 손전등, 배터리 등 비상용품 준비.",
  },
];

const REWRITES = [
  {
    bad: "화산재가 오면 조심하세요.",
    good: {
      who: "모든 가정",
      when: "화산재 낙하 경보·주의보 발표 시",
      what: "창문을 닫고 보건용 마스크를 착용한 뒤, 지자체·기상청 공식 안내를 확인한다.",
    },
  },
  {
    bad: "외출은 되도록 하지 않는 것이 좋습니다.",
    good: {
      who: "직장·학교 통학자",
      when: "외출이 불가피한 경우",
      what: "보건용 마스크·긴소매·안경을 착용하고, 체류 시간을 최소화한다.",
    },
  },
  {
    bad: "미리미리 잘 준비합시다.",
    good: {
      who: "가정 구성원",
      when: "평상시 및 관심·주의 단계",
      what: "생수 3일분, 비상식량, 상비약, 마스크, 손전등·배터리를 준비해 둔다.",
    },
  },
];

export default function GuidelinesSection() {
  return (
    <section id="guidelines" className="border-b border-slate-200 bg-[#FAFBFC] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="04 · Action"
          title="화산재 국민행동요령"
          description="좋은 행동요령의 3조건: 누가 · 언제 · 무엇을. “조심하세요” 같은 막연한 문장은 재난 상황에서 도움이 되지 않습니다."
          action={
            <a
              href="https://www.safekorea.go.kr/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#0B2B66] underline-offset-2 hover:underline"
            >
              국민재난안전포털 바로가기
            </a>
          }
        />

        <div className="mb-5 flex flex-wrap items-center gap-2">
          {["누가", "언제", "무엇을"].map((t) => (
            <span
              key={t}
              className="rounded-full bg-[#0B2B66] px-3 py-1 text-[11px] font-bold text-white"
            >
              {t}
            </span>
          ))}
          <SourceStamp source="국민재난안전포털 기준 재구성" className="ml-1" />
        </div>

        <div className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
            <h3 className="text-sm font-black text-[#0B2B66]">막연한 문장 → 구체적 행동요령</h3>
            <p className="mt-0.5 text-[11px] text-slate-500">
              누가 · 언제 · 무엇을 기준으로 작성합니다.
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {REWRITES.map((r) => (
              <div key={r.bad} className="grid gap-3 p-4 md:grid-cols-2">
                <div className="rounded-xl border border-red-100 bg-red-50/60 p-3">
                  <p className="mb-1 flex items-center gap-1 text-[10px] font-bold text-red-600">
                    <X size={12} /> 고치기 전 (나쁜 예)
                  </p>
                  <p className="text-sm text-red-900/80">“{r.bad}”</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                  <p className="mb-1 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                    <Check size={12} /> 고친 후 (누가·언제·무엇)
                  </p>
                  <dl className="space-y-1 text-xs text-emerald-950/90">
                    <div className="flex gap-2">
                      <dt className="w-8 shrink-0 font-bold text-emerald-700/70">누가</dt>
                      <dd>{r.good.who}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-8 shrink-0 font-bold text-emerald-700/70">언제</dt>
                      <dd>{r.good.when}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-8 shrink-0 font-bold text-emerald-700/70">무엇</dt>
                      <dd className="leading-relaxed">{r.good.what}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {GUIDES.map((g) => (
            <article
              key={g.where}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h3 className="text-base font-black text-[#0B2B66]">{g.where}</h3>
              <dl className="mt-3 space-y-2 text-xs">
                <div className="flex gap-2">
                  <dt className="w-10 shrink-0 font-bold text-slate-400">누가</dt>
                  <dd className="text-slate-800">{g.who}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-10 shrink-0 font-bold text-slate-400">언제</dt>
                  <dd className="text-slate-800">{g.when}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-10 shrink-0 font-bold text-slate-400">무엇</dt>
                  <dd className="leading-relaxed text-slate-800">{g.what}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
