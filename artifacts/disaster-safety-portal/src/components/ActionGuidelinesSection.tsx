import { Home, Wind, Car, Package, CheckSquare, HeartPulse } from "lucide-react";
import { useState } from "react";

const categories = [
  {
    id: "indoor",
    icon: Home,
    title: "실내 대피",
    subtitle: "Indoor Shelter-in-Place",
    color: "bg-blue-600",
    lightColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    actions: [
      {
        text: "모든 창문·출입문을 즉시 닫고 잠그세요",
        who: "모든 실내 거주자",
        when: "화산재 경보 발령 즉시",
        reason: "화산재 미세입자는 창틈으로 침투 가능",
      },
      {
        text: "창틀·문틈을 젖은 수건 또는 테이프로 밀봉하세요",
        who: "가정·사무실 거주자",
        when: "창문 닫은 직후",
        reason: "완전 밀폐로 실내 유입량 최소화",
      },
      {
        text: "에어컨·환기 시스템·자연환기를 모두 끄세요",
        who: "모든 실내 거주자",
        when: "화산재 낙하 중 전 기간",
        reason: "외기 유입 경로를 완전히 차단",
      },
      {
        text: "가급적 외출을 자제하고 실내에 머무르세요",
        who: "모든 시민",
        when: "심각 경보 발령 유지 중",
        reason: "실외 화산재 농도가 실내 대비 수십 배 높음",
      },
    ],
  },
  {
    id: "outdoor",
    icon: Wind,
    title: "부득이 외출 시",
    subtitle: "If Outdoors is Unavoidable",
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    actions: [
      {
        text: "반드시 KF94(또는 N95/FFP2) 보건용 마스크를 착용하세요",
        who: "외출하는 모든 시민",
        when: "문 열기 전",
        reason: "일반 면 마스크는 화산재 미세입자(< 10 µm) 차단 불가",
      },
      {
        text: "콘택트렌즈 대신 안경을 착용하세요",
        who: "렌즈 착용자",
        when: "외출 준비 시",
        reason: "화산재 유리질 입자가 각막을 직접 찰과·손상",
      },
      {
        text: "긴 소매·긴 바지로 피부 노출을 최소화하세요",
        who: "외출하는 모든 시민",
        when: "외출 전 착의 시",
        reason: "화산재 피부 접촉 시 자극·발진 유발 가능",
      },
      {
        text: "귀가 즉시 샤워하고 겉옷을 비닐봉지에 밀봉하세요",
        who: "외출 후 귀가자",
        when: "귀가 즉시 · 실내 진입 전",
        reason: "옷에 묻은 화산재를 실내로 유입시키지 않도록",
      },
    ],
  },
  {
    id: "vehicles",
    icon: Car,
    title: "건물·차량 관리",
    subtitle: "Buildings & Vehicles",
    color: "bg-red-600",
    lightColor: "bg-red-50",
    borderColor: "border-red-200",
    textColor: "text-red-700",
    actions: [
      {
        text: "차량 운행을 전면 자제하세요",
        who: "모든 차량 운전자",
        when: "화산재 낙하 중 전 기간",
        reason: "엔진 에어필터 손상·시야 차단·도로 미끄러움으로 사고 위험 급증",
      },
      {
        text: "지붕·옥상에 쌓인 화산재를 즉시 제거하세요",
        who: "건물 관리자·거주자",
        when: "적설 확인 즉시 (건식 상태일 때)",
        reason: "건조 10 cm 낙하 = 100 kg/m², 습윤 시 200 kg/m² → 지붕 붕괴 위험",
      },
      {
        text: "지하 주차장 환기구와 건물 외기 흡입구를 차단하세요",
        who: "건물 관리자",
        when: "경보 발령 즉시",
        reason: "화산재 유입 시 건물 전체 공기 오염",
      },
      {
        text: "화산재 제거 후 차량 에어필터를 즉시 교체하세요",
        who: "차량 소유자",
        when: "화산재 낙하 종료 후",
        reason: "막힌 에어필터로 엔진 과열·손상 예방",
      },
    ],
  },
  {
    id: "emergency-kit",
    icon: Package,
    title: "비상용품 준비",
    subtitle: "Emergency Kit",
    color: "bg-green-600",
    lightColor: "bg-green-50",
    borderColor: "border-green-200",
    textColor: "text-green-700",
    actions: [
      {
        text: "KF94 마스크를 1인당 최소 10매 이상 비축하세요",
        who: "모든 가정",
        when: "경계 경보 이전 사전 준비",
        reason: "화산재 낙하 기간 동안 마스크 품귀 현상 발생 가능",
      },
      {
        text: "밀봉 생수 최소 3일분(1인 3 L/일)을 확보하세요",
        who: "모든 가정",
        when: "경계 경보 이전 사전 준비",
        reason: "화산재 오염으로 수돗물 공급 차단 가능",
      },
      {
        text: "비상식량·상비약·손전등·배터리를 준비하세요",
        who: "모든 가정",
        when: "경보 발령 전 사전 준비",
        reason: "장기 실내 대피 대비 최소 72시간 생활 물자",
      },
      {
        text: "신분증·비상금·중요 문서를 방수 봉투에 준비하세요",
        who: "모든 가정",
        when: "대피 명령 가능성 시 즉시",
        reason: "대피 시 신속 이동 대비",
      },
    ],
  },
  {
    id: "health",
    icon: HeartPulse,
    title: "건강 보호",
    subtitle: "Health Protection",
    color: "bg-purple-600",
    lightColor: "bg-purple-50",
    borderColor: "border-purple-200",
    textColor: "text-purple-700",
    actions: [
      {
        text: "천식·심폐 질환자는 증상 악화 즉시 의료기관에 연락하세요",
        who: "천식·심폐 질환 보유자",
        when: "호흡 곤란·기침 증상 발생 시",
        reason: "화산재 흡입으로 기저 질환 급격히 악화 가능",
      },
      {
        text: "화산재가 눈에 들어갔을 때 비비지 말고 흐르는 물로 씻으세요",
        who: "화산재에 눈 노출된 모든 시민",
        when: "노출 즉시",
        reason: "비비면 각진 유리질 입자로 각막 찰과상 악화",
      },
      {
        text: "화산재로 오염된 수돗물은 사용하지 말고 비축 생수를 사용하세요",
        who: "모든 시민",
        when: "수도 당국 안내 있을 때",
        reason: "화산재 오염 시 pH 저하·중금속 용출 가능",
      },
      {
        text: "어린이·노인·임산부·기저질환자는 절대 외출하지 마세요",
        who: "고위험군 및 보호자",
        when: "심각 경보 발령 중 전 기간",
        reason: "면역·호흡 기능이 약한 취약 계층은 소량 흡입도 위험",
      },
    ],
  },
];

export default function ActionGuidelinesSection() {
  const [activeTab, setActiveTab] = useState("indoor");
  const active = categories.find((c) => c.id === activeTab)!;
  const Icon = active.icon;

  return (
    <section id="action-guidelines" className="py-16 bg-[#f5f7fa]">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-lg bg-[#0F3D91] p-2">
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Section 03</span>
        </div>
        <h2 data-testid="section-title-action-guidelines" className="text-2xl md:text-3xl font-black text-[#1a252f] mb-2">
          화산재 국민행동요령
        </h2>
        <p className="text-slate-500 text-sm mb-8 max-w-2xl">
          화산재 낙하 상황별 구체적 행동지침 — 국민재난안전포털 기준 · 누가·언제·무엇을 명시
        </p>

        {/* Criteria strip */}
        <div data-testid="guideline-criteria"
          className="mb-8 flex flex-col items-start gap-4 rounded-2xl bg-[#0F3D91] p-4 text-white sm:flex-row sm:items-center">
          <p className="text-slate-300 text-sm font-medium sm:w-48 shrink-0">좋은 행동요령 3조건</p>
          <div className="flex gap-3 flex-wrap">
            {[
              { tag: "누가", desc: "행동 주체가 명확한가?" },
              { tag: "언제", desc: "타이밍이 구체적인가?" },
              { tag: "무엇을", desc: "구체적인 행동이 명시됐는가?" },
            ].map((c) => (
              <div key={c.tag} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded">{c.tag}</span>
                <span className="text-slate-300 text-xs">{c.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const CatIcon = cat.icon;
            return (
              <button key={cat.id} data-testid={`tab-${cat.id}`}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === cat.id
                    ? "bg-[#0F3D91] text-white shadow-sm"
                    : "border border-slate-200 bg-white text-slate-600 hover:text-slate-800"
                }`}>
                <CatIcon size={14} />
                {cat.title}
              </button>
            );
          })}
        </div>

        {/* Active category */}
        <div data-testid={`guidelines-${activeTab}`}
          className={`bg-white rounded-2xl border ${active.borderColor} shadow-sm overflow-hidden`}>
          <div className={`${active.color} px-6 py-4 flex items-center gap-3`}>
            <Icon size={20} className="text-white" />
            <div>
              <h3 className="text-white font-bold text-base">{active.title}</h3>
              <p className="text-white/70 text-xs">{active.subtitle}</p>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {active.actions.map((action, idx) => (
              <div key={idx} data-testid={`action-item-${idx}`}
                className={`${active.lightColor} rounded-xl p-4 border ${active.borderColor}`}>
                <div className="flex items-start gap-3">
                  <div className={`${active.color} text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1">
                    <p className={`font-semibold text-sm ${active.textColor} mb-2`}>{action.text}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-500 mb-2">
                      <span className="flex items-center gap-1">
                        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium">누가</span>
                        {action.who}
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded font-medium">언제</span>
                        {action.when}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs italic">이유: {action.reason}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div data-testid="warning-box"
          className="mt-5 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-red-500 text-lg mt-0.5">⚠</span>
          <div>
            <p className="text-red-700 font-semibold text-sm mb-1">
              주의: "조심하세요" 같은 막연한 안내는 화산재 재난에서 아무 도움이 되지 않습니다
            </p>
            <p className="text-red-600 text-xs leading-relaxed">
              화산재는 눈에 잘 보이지 않는 미세 입자입니다. <strong>누가·언제·무엇을</strong> 구체적으로
              명시한 행동요령만이 실제 위험에서 국민의 생명을 지킬 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
