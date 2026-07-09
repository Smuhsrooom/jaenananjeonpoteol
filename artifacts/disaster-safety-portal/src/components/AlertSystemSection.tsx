import { Radio, Building2, Plane, Cloud } from "lucide-react";

const alertLevels = [
  {
    level: "관심",
    levelEn: "Blue",
    dot: "bg-blue-500",
    border: "border-blue-300",
    bg: "bg-blue-50",
    text: "text-blue-700",
    badge: "bg-blue-100 text-blue-800",
    situation: "화산재 발생 가능성을 감시하는 단계",
    example: "백두산 천지 주변 화산성 지진 증가, 지표 변형 소규모 관측",
    ashLevel: "화산재 없음",
    citizenAction: "일상 유지 · 뉴스 주시",
    isActive: false,
  },
  {
    level: "주의",
    levelEn: "Yellow",
    dot: "bg-yellow-400",
    border: "border-yellow-300",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-800",
    situation: "화산재 징후가 뚜렷해져 협조 체계 점검",
    example: "지진 급증, 산 표면 팽창, 화산성 가스 농도 상승",
    ashLevel: "확산 예보 단계",
    citizenAction: "마스크·비상식량 점검, 대피 경로 숙지",
    isActive: false,
  },
  {
    level: "경계",
    levelEn: "Orange",
    dot: "bg-orange-500",
    border: "border-orange-300",
    bg: "bg-orange-50",
    text: "text-orange-700",
    badge: "bg-orange-100 text-orange-800",
    situation: "화산재 낙하 임박 — 대비 태세 전환",
    example: "분화 임박 징후, KF94 마스크 비축, 항공 운항 조정 검토",
    ashLevel: "낙하 임박 / 소량 낙하",
    citizenAction: "외출 자제, 창문 밀폐 시작, 차량 이동 최소화",
    isActive: false,
  },
  {
    level: "심각",
    levelEn: "Red",
    dot: "bg-red-600",
    border: "border-red-400",
    bg: "bg-red-50",
    text: "text-red-700",
    badge: "bg-red-100 text-red-800",
    situation: "화산재 대량 낙하 — 전면 대응",
    example: "분화 시작, 화산재 기둥 성층권 진입, 화산재 광역 낙하",
    ashLevel: "대량 낙하 진행 중",
    citizenAction: "완전 실내 대피, KF94 착용 필수, 정부 안내 즉시 이행",
    isActive: true,
  },
];

const ashConcentrationLevels = [
  { name: "좋음",   range: "0 ~ 0.05 mg/m³", color: "bg-green-500",  textColor: "text-green-700",  bgColor: "bg-green-50",  action: "정상 활동 가능" },
  { name: "보통",   range: "0.05 ~ 0.15",    color: "bg-yellow-400", textColor: "text-yellow-700", bgColor: "bg-yellow-50", action: "민감 계층 주의" },
  { name: "나쁨",   range: "0.15 ~ 0.35",    color: "bg-orange-500", textColor: "text-orange-700", bgColor: "bg-orange-50", action: "마스크 착용 권고" },
  { name: "매우나쁨", range: "0.35 이상",    color: "bg-red-600",    textColor: "text-red-700",    bgColor: "bg-red-50",    action: "외출 금지 · 완전 밀폐" },
];

const govAgencies = [
  {
    name: "행정안전부",
    badge: "총괄 지휘",
    desc: "중앙재난안전대책본부(중대본) 운영. 화산재 경보 발령, 전 부처 대응 총괄 지휘.",
    color: "bg-[#1a252f]",
    icon: Building2,
  },
  {
    name: "기상청",
    badge: "예보·분석",
    desc: "화산재 확산 경로·농도 예측 모델 운영. 지역별 낙하 예보 6시간 단위 갱신.",
    color: "bg-sky-700",
    icon: Cloud,
  },
  {
    name: "국토교통부",
    badge: "항공 대응",
    desc: "화산재 농도 기준 항공 운항 제한·중단 결정. 국제 항공기관(ICAO) 협조 체계 운영.",
    color: "bg-violet-700",
    icon: Plane,
  },
];

export default function AlertSystemSection() {
  return (
    <section id="alert-system" className="py-16 bg-[#f5f7fa]">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-lg bg-[#0F3D91] p-2">
            <Radio size={18} className="text-white" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Section 02</span>
        </div>
        <h2 data-testid="section-title-alert-system" className="text-2xl md:text-3xl font-black text-[#1a252f] mb-2">
          화산재 위기경보 시스템
        </h2>
        <p className="text-slate-500 text-sm mb-10 max-w-2xl">
          화산재 낙하 단계별 경보 체계, 화산재 농도 기준, 재난 대응 기관 역할
        </p>

        {/* Current alert banner */}
        <div data-testid="current-alert-status"
          className="mb-8 flex flex-col gap-3 rounded-2xl bg-[#D32F2F] p-5 text-white sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 bg-white rounded-full alert-pulse shrink-0" />
            <span className="font-black text-lg uppercase tracking-wide">현재: 심각 (RED) — 화산재 대량 낙하 진행</span>
          </div>
          <p className="text-red-100 text-sm sm:ml-auto">
            외출 전면 자제 · KF94 마스크 착용 · 창문·문 완전 밀폐
          </p>
        </div>

        {/* 4 alert level cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {alertLevels.map((lv) => (
            <div key={lv.level} data-testid={`alert-level-${lv.level}`}
              className={`rounded-2xl border-2 ${lv.border} ${lv.bg} p-5 relative ${
                lv.isActive ? "shadow-xl ring-2 ring-red-500 ring-offset-2" : ""
              }`}>
              {lv.isActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide whitespace-nowrap">
                    현재 단계
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 mb-3 mt-1">
                <div className={`w-4 h-4 rounded-full ${lv.dot} ${lv.isActive ? "alert-pulse" : ""}`} />
                <span className={`text-xs font-bold uppercase tracking-wider ${lv.text}`}>{lv.levelEn}</span>
              </div>

              <h3 className={`font-black text-2xl ${lv.text} mb-1`}>{lv.level}</h3>
              <p className="text-slate-600 text-xs leading-relaxed mb-3">{lv.situation}</p>

              <div className="border-t border-slate-200 pt-3 space-y-2.5">
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mb-0.5">화산재 상태</p>
                  <p className={`text-xs font-semibold ${lv.text}`}>{lv.ashLevel}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mb-0.5">상황 예시</p>
                  <p className="text-slate-600 text-xs leading-snug">{lv.example}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wide mb-0.5">국민 행동</p>
                  <p className={`text-xs font-bold leading-snug ${lv.text}`}>{lv.citizenAction}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Ash concentration standards */}
        <div className="bg-[#f4f6f8] rounded-2xl p-6 md:p-8 mb-8">
          <h3 className="text-[#1a252f] font-bold text-lg mb-1">화산재 농도 기준 및 행동 지침</h3>
          <p className="text-slate-500 text-sm mb-5">공기 중 화산재 미세입자(PM₁₀ 유사 기준) 농도별 위험 단계</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ashConcentrationLevels.map((lv) => (
              <div key={lv.name} data-testid={`ash-conc-${lv.name}`}
                className={`${lv.bgColor} rounded-xl p-4 border border-slate-200`}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${lv.color}`} />
                  <span className={`font-black text-sm ${lv.textColor}`}>{lv.name}</span>
                </div>
                <p className="text-slate-500 text-[10px] font-mono mb-2">{lv.range} mg/m³</p>
                <p className={`text-xs font-semibold ${lv.textColor}`}>{lv.action}</p>
              </div>
            ))}
          </div>
          <p className="text-slate-400 text-xs mt-3 text-center">
            * 현재 강원도 일부 지역 화산재 농도: 매우나쁨 수준 측정 중 (기상청 실시간 관측 기준)
          </p>
        </div>

        {/* Gov agencies */}
        <div className="bg-[#f4f6f8] rounded-2xl p-6 md:p-8">
          <h3 className="text-[#1a252f] font-bold text-lg mb-1">화산재 재난 대응 기관 체계</h3>
          <p className="text-slate-500 text-sm mb-5">중앙(총괄·전문기관) → 현장(지자체)으로 이어지는 화산재 대응 체계</p>
          <div className="grid sm:grid-cols-3 gap-4">
            {govAgencies.map((ag, idx) => {
              const Icon = ag.icon;
              return (
                <div key={ag.name} data-testid={`agency-card-${idx}`} className="bg-white rounded-xl p-5 border border-border shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`${ag.color} rounded-lg w-9 h-9 flex items-center justify-center`}>
                      <Icon size={16} className="text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="font-bold text-[#1a252f] text-sm">{ag.name}</p>
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded">{ag.badge}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">{ag.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-5 flex items-center gap-2 text-xs text-slate-400 justify-center flex-wrap">
            <span className="font-semibold text-[#1a252f]">행정안전부 (지휘)</span>
            <span>→</span>
            <span className="font-semibold text-sky-700">기상청 (예보)</span>
            <span>→</span>
            <span className="font-semibold text-violet-700">국토교통부 (항공)</span>
            <span>→</span>
            <span className="font-semibold text-green-700">지자체 (현장 대피)</span>
          </div>
        </div>
      </div>
    </section>
  );
}
