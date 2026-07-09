import SectionHeader from "@/components/SectionHeader";

const ACTORS = [
  {
    role: "총괄",
    name: "행정안전부",
    desc: "국가 재난관리를 총괄합니다. 대규모 재난 시 중앙재난안전대책본부(중대본)를 꾸려 범정부 대응을 지휘합니다.",
  },
  {
    role: "전문",
    name: "기상청",
    desc: "화산·지진·기상 상황을 관측하고 정보를 발표합니다. 화산재 확산 예측도 담당합니다.",
  },
  {
    role: "현장",
    name: "시·도 및 시·군·구",
    desc: "지역재난안전대책본부를 운영하며 주민 대피, 대피소 운영 등 현장 대응을 맡습니다.",
  },
];

const STAGES = [
  { step: "예방", ex: "관측 장비 설치, 위험 지도" },
  { step: "대비", ex: "대피 계획, 훈련, 비상물자" },
  { step: "대응", ex: "경보 발령, 대피·구조·구급" },
  { step: "복구", ex: "화산재 제거, 보상, 시설 복구" },
];

export default function SystemSection() {
  return (
    <section id="system" className="border-b border-slate-200 bg-[#FAFBFC] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="02 · Governance"
          title="누가 재난에 대응하는가"
          description="중앙(총괄·전문기관) → 지역(현장 대응) 체계를 알아야, 웹에서 ‘어떤 정보를 누구 이름으로 낼지’ 정할 수 있습니다."
        />

        <div className="grid gap-4 md:grid-cols-3">
          {ACTORS.map((a, i) => (
            <div
              key={a.name}
              className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <span className="text-[10px] font-black text-slate-300">0{i + 1}</span>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-orange-600">
                {a.role}
              </p>
              <h3 className="mt-1 text-base font-black text-[#0B2B66]">{a.name}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-600">{a.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <h3 className="text-sm font-black text-[#0B2B66]">재난관리 4단계</h3>
          <p className="mt-1 text-xs text-slate-500">
            예방 → 대비 → 대응 → 복구 — 정부 매뉴얼의 뼈대이자 메뉴 구조로도 쓸 수 있습니다.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4">
            {STAGES.map((s, i) => (
              <div
                key={s.step}
                className="rounded-xl border border-slate-100 bg-[#FAFBFC] px-3 py-3 text-center"
              >
                <p className="text-[10px] font-bold text-slate-400">{i + 1}</p>
                <p className="text-sm font-black text-[#0B2B66]">{s.step}</p>
                <p className="mt-1 text-[10px] text-slate-500">{s.ex}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
