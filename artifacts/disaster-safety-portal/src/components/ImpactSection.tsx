import SectionHeader from "@/components/SectionHeader";
import SourceStamp from "@/components/SourceStamp";
import { Plane } from "lucide-react";

const MAIN = {
  sector: "항공·교통",
  type: "간접 · 1순위 브리핑",
  body: "화산재의 미세 유리 입자는 항공기 제트 엔진을 손상시킬 수 있습니다. 백두산 분화 시 남한은 직접 두껍게 덮이기보다, 하늘길·물류 연결망을 통한 간접 영향이 클 수 있습니다. 일상에서 가장 먼저·크게 체감할 수 있는 분야로 항공·교통을 우선 안내합니다.",
  points: [
    "엔진 손상 위험 → 운항 대규모 중단 가능",
    "2010 아이슬란드: 유럽 하늘길 마비, 수백만 명 발 묶임",
    "간접 영향권 ≠ 안전하다 — 연결망 리스크",
  ],
};

const IMPACTS = [
  {
    sector: "농업·식량",
    type: "간접",
    body: "바람을 탄 화산재가 농작물에 내려앉으면 수확량이 줄고 식량 가격이 오를 수 있습니다.",
  },
  {
    sector: "보건·사회",
    type: "간접",
    body: "호흡기 질환 증가, 마스크·생수 사재기 등 사회 혼란이 나타날 수 있습니다.",
  },
  {
    sector: "경제·생활",
    type: "간접",
    body: "물류·관광·생산 차질이 연쇄적으로 일상에 영향을 줄 수 있습니다.",
  },
  {
    sector: "기후",
    type: "간접(대규모 시)",
    body: "매우 큰 분화라면 화산재와 가스가 성층권까지 올라가 한동안 기온이 낮아질 수 있습니다.",
  },
  {
    sector: "국제 관계",
    type: "직접·간접",
    body: "가장 큰 직접 피해는 북한·중국 인근. 인도적 지원, 정보 공유, 국내 체류 외국인·관광객 보호가 필요합니다.",
  },
];

export default function ImpactSection() {
  return (
    <section id="impact" className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="05 · Briefing"
          title="백두산이 분화하면 우리나라는?"
          description="남한은 거리가 멀어 ‘직접 두껍게 쌓이는’ 피해보다 간접 영향 가능성이 큽니다. 과장된 공포가 아니라 정확한 구분이 전문가다운 태도입니다."
          action={<SourceStamp source="영향 분석 · 항공·교통 우선" />}
        />

        <article className="mb-6 overflow-hidden rounded-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:p-7">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <Plane size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                우선 브리핑 분야
              </p>
              <h3 className="mt-1 text-xl font-black text-[#0B2B66] md:text-2xl">
                {MAIN.sector}
              </h3>
              <span className="mt-1 inline-block rounded-full bg-orange-100 px-2.5 py-0.5 text-[10px] font-bold text-orange-800">
                {MAIN.type}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{MAIN.body}</p>
              <ul className="mt-3 space-y-1.5 text-xs text-slate-600">
                {MAIN.points.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="font-bold text-orange-500">·</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <div className="mb-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-4">
            <p className="text-[10px] font-bold text-slate-400">직접 피해권</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              북한 양강도·중국 지린성 등 백두산 인근
            </p>
          </div>
          <div className="rounded-2xl border border-[#0B2B66]/20 bg-[#0B2B66]/5 p-4">
            <p className="text-[10px] font-bold text-[#0B2B66]">남한 — 간접 영향 중심</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">
              항공 마비, 대기·보건, 물류·물가 등 연결망을 타고 파급
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {IMPACTS.map((item) => (
            <article
              key={item.sector}
              className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-black text-[#0B2B66]">{item.sector}</h3>
                <span className="rounded-full border border-slate-100 bg-white px-2 py-0.5 text-[10px] font-bold text-slate-500">
                  {item.type}
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{item.body}</p>
            </article>
          ))}
        </div>

        {/* 읽기거리 */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              읽을거리 · 2010
            </p>
            <h3 className="mt-1 text-sm font-black text-[#0B2B66]">
              하늘길이 멈춘 일주일 — 아이슬란드 화산
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              2010년 4월, 에이야프얄라요쿨 화산이 분화했습니다. 화산 자체 규모는 역사 최대가
              아니었지만, 하늘로 치솟은 화산재가 유럽 상공을 덮어 각국이 하늘길을 잇달아 닫았고
              수백만 명의 발이 묶였습니다. 화산 재난의 피해는 ‘화산에서 가까운 곳’에만 머물지
              않습니다.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              읽을거리 · 946
            </p>
            <h3 className="mt-1 text-sm font-black text-[#0B2B66]">
              백두산은 이미 한 번 깨어난 적 있다 — 밀레니엄 대분화
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              과학자들은 서기 946년경 백두산에서 매우 강력한 분화(추정 VEI 7)가 있었다고 봅니다.
              뿜어져 나온 화산재는 멀리 일본에서도 지층으로 발견될 정도였습니다. 백두산은 단순한
              관광지가 아니라 살아있는 활화산이며, 사전 대비와 정확한 정보 확인이 필요합니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
