import { BookOpen, CheckCircle2, Layers, FlameKindling } from "lucide-react";

const ashProperties = [
  { label: "입자 크기", value: "0.001 ~ 2 mm", desc: "미세 입자는 마스크 없이 흡입 시 폐 깊숙이 침투", icon: "🔬" },
  { label: "화학 성분", value: "SiO₂, 유리질", desc: "각진 유리질 파편이 호흡기·눈·피부를 자극", icon: "⚗️" },
  { label: "무게 (건조)", value: "약 1 t/m³", desc: "지붕 위 10 cm 낙하 시 100 kg/m² 하중 발생", icon: "⚖️" },
  { label: "무게 (습윤)", value: "약 2 t/m³", desc: "빗물에 젖으면 무게 2배 → 건물 붕괴 위험 증가", icon: "🌧" },
];

const managementStages = [
  {
    number: "01",
    title: "예방",
    subtitle: "Prevention",
    desc: "화산재 피해를 줄이기 위한 사전 조치",
    example: "백두산 관측망 구축, 화산재 낙하 위험 지도 제작, 항공 경보 시스템 운영",
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    textColor: "text-blue-700",
    borderColor: "border-blue-200",
  },
  {
    number: "02",
    title: "대비",
    subtitle: "Preparedness",
    desc: "화산재 낙하에 대비한 계획·물자 준비",
    example: "KF94 마스크 비축, 항공 운항 조정 계획, 농업 피해 보상 기준 마련",
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-700",
    borderColor: "border-amber-200",
  },
  {
    number: "03",
    title: "대응",
    subtitle: "Response",
    desc: "화산재 낙하 직후 피해 최소화 활동",
    example: "화산재 경보 발령, 대피 안내, 항공 운항 전면 중단, 야외 활동 금지령",
    color: "bg-red-600",
    lightColor: "bg-red-50",
    textColor: "text-red-700",
    borderColor: "border-red-200",
  },
  {
    number: "04",
    title: "복구",
    subtitle: "Recovery",
    desc: "화산재 제거 및 피해 이전 상태 회복",
    example: "화산재 제거·청소, 농작물 피해 보상, 항공·도로 시설 정비",
    color: "bg-green-600",
    lightColor: "bg-green-50",
    textColor: "text-green-700",
    borderColor: "border-green-200",
  },
];

const healthRisks = [
  { target: "호흡기", icon: "🫁", risk: "고위험", desc: "미세 화산재 입자(< 10 µm)가 기도 깊숙이 침투. 천식·만성폐쇄성폐질환(COPD) 악화.", color: "bg-red-50 border-red-200 text-red-700" },
  { target: "눈·피부", icon: "👁", risk: "중위험", desc: "각진 유리질 입자가 각막·피부를 자극·찰과. 콘택트렌즈 착용자 각막 손상 위험.", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { target: "상수도·식수", icon: "💧", risk: "중위험", desc: "화산재 침전으로 상수원 오염, pH 저하. 반드시 비축 생수 사용.", color: "bg-amber-50 border-amber-200 text-amber-700" },
  { target: "정신건강", icon: "🧠", risk: "주의", desc: "장기 대피·생활 제한으로 불안·스트레스 증가. 취약 계층(노인·아동) 심리 지원 필요.", color: "bg-blue-50 border-blue-200 text-blue-700" },
];

export default function DisasterDefinitionSection() {
  return (
    <section id="definition" className="bg-[#f8fafc] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-3 flex items-center gap-3">
          <div className="rounded-2xl bg-slate-900 p-2.5 shadow-lg shadow-slate-900/10">
            <BookOpen size={18} className="text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">Section 01</span>
        </div>
        <h2 data-testid="section-title-definition" className="mb-2 text-2xl font-black text-slate-900 sm:text-3xl">
          화산재 재난 — 법적 근거와 위해 특성
        </h2>
        <p className="mb-10 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          「재난 및 안전관리 기본법」상 화산활동의 법적 위치, 화산재의 물리·화학적 특성, 건강 위해 수준
        </p>

        {/* Legal definition box */}
        <div data-testid="legal-definition-box" className="relative mb-8 overflow-hidden rounded-[28px] bg-slate-900 p-6 text-white shadow-2xl shadow-slate-900/10 md:p-8">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/3 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-amber-500 rounded-lg p-2 shrink-0">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">「재난 및 안전관리 기본법」 — 화산활동의 법적 위치</h3>
                <p className="text-slate-300 text-sm leading-relaxed">
                  동법은 재난을{" "}
                  <span className="text-white font-semibold">'국민의 생명·신체·재산과 국가에 피해를 주거나 줄 수 있는 것'</span>
                  으로 정의하며, <strong className="text-amber-400">화산활동</strong>을{" "}
                  <strong className="text-amber-400">자연재난</strong>으로 명시합니다.
                  즉 백두산 분화와 이로 인한 화산재 낙하는 국가가 법에 따라 반드시 관리해야 하는
                  <strong className="text-white"> 공식 재난</strong>입니다.
                </p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 mt-2">
              <div className="bg-amber-500/20 border border-amber-500/40 rounded-xl px-4 py-3">
                <p className="text-amber-300 text-xs font-bold mb-1 uppercase tracking-wide">자연재난 (법 제3조)</p>
                <p className="text-amber-100 text-sm">
                  태풍·홍수·지진·<strong>화산활동</strong>·폭설 등 자연현상에 의한 재난 — 화산재 낙하 포함
                </p>
              </div>
              <div className="bg-white/8 border border-white/15 rounded-xl px-4 py-3">
                <p className="text-slate-300 text-xs font-bold mb-1 uppercase tracking-wide">관리 주체</p>
                <p className="text-slate-200 text-sm">
                  행정안전부(중대본) 총괄 지휘 · 기상청 화산재 확산 예보 · 지자체 현장 대응
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Ash physical properties */}
        <div className="mb-8 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="bg-amber-100 rounded-lg p-2">
              <Layers size={18} className="text-amber-600" />
            </div>
            <div>
              <h3 className="text-[#1a252f] font-bold text-base">화산재의 물리·화학적 특성</h3>
              <p className="text-slate-500 text-xs">왜 화산재가 위험한가? — 일반 먼지와 다른 점</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ashProperties.map((p) => (
              <div key={p.label} data-testid={`ash-property-${p.label}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-2xl mb-2">{p.icon}</div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mb-0.5">{p.label}</p>
                <p className="text-[#1a252f] font-black text-sm mb-1.5">{p.value}</p>
                <p className="text-slate-500 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Health risks */}
        <div className="mb-8 rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-red-100 p-2">
              <FlameKindling size={18} className="text-red-600" />
            </div>
            <div>
              <h3 className="text-[#1a252f] font-bold text-base">화산재 건강 위해 분류</h3>
              <p className="text-slate-500 text-xs">신체 부위·계통별 화산재 노출 위험도</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {healthRisks.map((r) => (
              <div key={r.target} data-testid={`health-risk-${r.target}`} className={`rounded-xl p-4 border ${r.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{r.icon}</span>
                  <div>
                    <span className="font-bold text-sm">{r.target}</span>
                    <span className="ml-2 text-[10px] font-bold bg-white/60 rounded-full px-2 py-0.5">{r.risk}</span>
                  </div>
                </div>
                <p className="text-sm leading-relaxed opacity-90">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 management stages */}
        <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <h3 className="text-[#1a252f] font-bold text-lg mb-1">화산재 재난관리 4단계</h3>
          <p className="text-slate-500 text-sm mb-6">정부 재난관리 매뉴얼 핵심 체계 — 화산재 시나리오 적용</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {managementStages.map((stage, idx) => (
              <div key={stage.title} data-testid={`card-stage-${idx + 1}`}
                className={`rounded-xl border ${stage.borderColor} ${stage.lightColor} p-4`}>
                <div className={`${stage.color} text-white text-xs font-black w-8 h-8 rounded-lg flex items-center justify-center mb-3`}>
                  {stage.number}
                </div>
                <h4 className={`font-bold text-sm ${stage.textColor} mb-0.5`}>{stage.title}</h4>
                <p className="text-slate-400 text-xs mb-2">{stage.subtitle}</p>
                <p className="text-slate-600 text-xs leading-relaxed mb-2">{stage.desc}</p>
                <p className="text-slate-400 text-xs italic">예: {stage.example}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-center gap-1 text-slate-400 text-xs flex-wrap">
            {managementStages.map((s, i) => (
              <span key={s.title} className="flex items-center gap-1">
                <span className={`font-bold ${s.textColor}`}>{s.title}</span>
                {i < managementStages.length - 1 && <span className="text-slate-300">→</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
