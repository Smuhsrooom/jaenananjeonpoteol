import { BarChart3 } from "lucide-react";

const impacts = [
  {
    sector: "항공·교통",
    sectorEn: "Aviation & Transport",
    icon: "✈",
    severity: "critical",
    mechanism: "화산재 입자가 항공기 엔진 터빈 블레이드를 녹여 고착 → 출력 손실·엔진 정지",
    southKorea: "인천·김포·김해 등 국제공항 운항 전면 중단 가능. 수출입 항공화물 마비.",
    example: "2010 아이슬란드 에이야퍄들 화산 → 유럽 항공 6일 마비, ~10만 편 취소",
    likelihood: 92,
    ashThreshold: "0.2 mg/m³ 이상 시 운항 중단 권고",
  },
  {
    sector: "농업·식량",
    sectorEn: "Agriculture & Food",
    icon: "🌾",
    severity: "high",
    mechanism: "화산재 낙하 → 엽면 피복으로 광합성 차단, 산성 화학성분이 작물 직접 손상",
    southKorea: "강원·경기 농작물 피해 예상. 화산재 1 mm 이상 낙하 시 수확량 10~30% 감소.",
    example: "1991 피나투보 화산(필리핀) → 주변 농경지 전멸, 식량 가격 급등",
    likelihood: 70,
    ashThreshold: "낙하량 1 mm 이상 시 피해 시작",
  },
  {
    sector: "보건·건강",
    sectorEn: "Public Health",
    icon: "🏥",
    severity: "high",
    mechanism: "화산재 미세입자(< 10 µm) 흡입 → 기도 염증·폐 손상. 유리질 입자가 눈·피부 찰과.",
    southKorea: "응급실 호흡기 환자 급증. 마스크·안약 품귀. 노인·아동·기저질환자 집중 피해.",
    example: "2011 시나부는 화산(인도네시아) → 주변 주민 호흡기 질환 입원 400% 증가",
    likelihood: 80,
    ashThreshold: "PM₁₀ 0.15 mg/m³ 이상 시 외출 자제",
  },
  {
    sector: "경제·산업",
    sectorEn: "Economy & Industry",
    icon: "💰",
    severity: "medium",
    mechanism: "항공 물류 차질 → 반도체·전자 부품 공급망 중단. 화산재 청소·장비 교체 비용 증가.",
    southKorea: "항공화물 의존도 높은 반도체·IT 수출 지연. 관광업 타격. 청소·복구 비용 수천억 예상.",
    example: "2010 아이슬란드 화산 → 유럽 항공 경제 손실 약 1.3조 원(13억 유로)",
    likelihood: 68,
    ashThreshold: "항공 마비 지속 시 공급망 충격 발생",
  },
  {
    sector: "전력·기반시설",
    sectorEn: "Power & Infrastructure",
    icon: "⚡",
    severity: "medium",
    mechanism: "화산재가 송전선 절연체 오염 → 단락·정전. 수처리 시설 침전물 증가 → 공급 차질.",
    southKorea: "북동부 지역 태양광 패널 출력 감소. 정수장 화산재 유입 시 수돗물 공급 일시 중단.",
    example: "1991 피나투보 화산 → 필리핀 광역 정전, 수도 공급 수일간 중단",
    likelihood: 45,
    ashThreshold: "낙하량 5 mm 이상 시 기반시설 피해 가능",
  },
  {
    sector: "국제·인도적",
    sectorEn: "International & Humanitarian",
    icon: "🤝",
    severity: "low",
    mechanism: "직접 피해권인 북한 주민 대규모 이재민 발생. 한·중·일 재난 정보 공유 필요.",
    southKorea: "국내 체류 외국인 보호 대책 필요. 북한 인도적 지원 논의. 다국어 안내 의무화.",
    example: "재난 발생 시 한·중·일 공동 화산재 확산 예측 모델 운영 협약 필요",
    likelihood: 40,
    ashThreshold: "분화 규모에 따라 국제 협력 수준 결정",
  },
];

const severityConfig: Record<string, { label: string; tc: string; bg: string; border: string; bar: string }> = {
  critical: { label: "매우 높음", tc: "text-red-700",    bg: "bg-red-100",    border: "border-red-300",    bar: "bg-red-600" },
  high:     { label: "높음",     tc: "text-amber-700",   bg: "bg-amber-100",  border: "border-amber-300",  bar: "bg-amber-500" },
  medium:   { label: "중간",     tc: "text-blue-700",    bg: "bg-blue-100",   border: "border-blue-300",   bar: "bg-blue-500" },
  low:      { label: "낮음",     tc: "text-green-700",   bg: "bg-green-100",  border: "border-green-300",  bar: "bg-green-500" },
};

export default function ImpactBriefingSection() {
  return (
    <section id="impact-briefing" className="py-16 bg-[#f5f7fa]">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <div className="rounded-lg bg-[#0F3D91] p-2">
            <BarChart3 size={18} className="text-white" />
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Section 04</span>
        </div>
        <h2 data-testid="section-title-impact" className="text-2xl md:text-3xl font-black text-[#1a252f] mb-2">
          화산재 피해 — 분야별 영향 브리핑
        </h2>
        <p className="text-slate-500 text-sm mb-8 max-w-2xl">
          백두산 화산재가 한국 사회·경제에 미치는 분야별 피해 메커니즘과 규모 예측
        </p>

        {/* Expert note */}
        <div data-testid="expert-note"
          className="mb-8 flex items-start gap-4 rounded-2xl bg-[#0F3D91] p-5 text-white">
          <div className="bg-amber-500 rounded-lg p-2 shrink-0">
            <BarChart3 size={18} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base mb-1">전문가 평가 기준</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              직접 피해권은 <strong className="text-white">북한 양강도·중국 지린성</strong> 등 백두산 인근입니다.
              남한은 <strong className="text-amber-400">화산재 간접 피해</strong>가 중심입니다.
              과장된 공포보다 <strong className="text-white">피해 메커니즘과 화산재 농도 기준</strong>에 근거한
              냉정한 대응이 필요합니다.
            </p>
          </div>
        </div>

        {/* Impact cards grid */}
        <div className="grid md:grid-cols-2 gap-5 mb-10">
          {impacts.map((row, idx) => {
            const sev = severityConfig[row.severity];
            return (
              <div key={row.sector} data-testid={`impact-card-${idx}`}
                className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
                {/* Card header */}
                <div className="flex items-center gap-3 p-4 border-b border-border bg-slate-50/50">
                  <span className="text-2xl">{row.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-[#1a252f] text-sm">{row.sector}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sev.tc} ${sev.bg} ${sev.border}`}>
                        {sev.label}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">{row.sectorEn}</p>
                  </div>
                  {/* Likelihood bar */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-slate-400 text-[10px]">발생 가능성</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-20 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-full rounded-full ${sev.bar}`} style={{ width: `${row.likelihood}%` }} />
                      </div>
                      <span className={`text-xs font-bold ${sev.tc}`}>{row.likelihood}%</span>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">피해 메커니즘</p>
                    <p className="text-slate-600 text-xs leading-relaxed">{row.mechanism}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">한국 예상 영향</p>
                    <p className="text-slate-700 text-xs leading-relaxed font-medium">{row.southKorea}</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">참고 사례</p>
                      <p className="text-slate-500 text-xs leading-relaxed italic">{row.example}</p>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2.5 border border-border shrink-0 max-w-[180px]">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">피해 발생 기준</p>
                      <p className="text-slate-600 text-[10px] leading-snug">{row.ashThreshold}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Iceland case study */}
        <div data-testid="iceland-case-study"
          className="bg-[#f4f6f8] border border-border rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl shrink-0">🗺</div>
            <div className="flex-1">
              <h3 className="font-bold text-[#1a252f] text-base mb-1">
                핵심 참고 사례 — 2010년 아이슬란드 에이야퍄들라이외퀴들 화산 (4등급)
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-4">
                2010년 4월, 화산재 구름이 유럽 전역을 뒤덮어 국제항공 체계가 마비됐습니다.
                이 사례는 화산재가 <strong>직접 낙하 피해 지역이 아닌 원거리 국가</strong>에도
                항공·물류·경제를 통해 심각한 <strong>간접 피해</strong>를 줄 수 있음을 증명합니다.
              </p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {[
                  { icon: "✈", label: "항공 운항 취소", value: "~10만 편", sub: "유럽 전역 6일 마비" },
                  { icon: "👥", label: "발이 묶인 승객", value: "1,000만 명+", sub: "전 세계 공항 체류" },
                  { icon: "💶", label: "항공업 손실", value: "~13억 유로", sub: "약 1.8조 원" },
                  { icon: "🌍", label: "영향 국가", value: "40개국+", sub: "화산 위치에서 최대 3,000 km" },
                ].map((s) => (
                  <div key={s.label} data-testid={`iceland-stat-${s.label}`}
                    className="bg-white rounded-xl p-3 border border-border text-center">
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <p className="font-black text-[#1a252f] text-base">{s.value}</p>
                    <p className="text-slate-600 text-xs font-medium">{s.label}</p>
                    <p className="text-slate-400 text-[10px] mt-0.5">{s.sub}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                <p className="text-amber-800 text-xs font-semibold leading-relaxed">
                  <strong>백두산 적용:</strong> 백두산 화산재가 편서풍을 타고 한반도로 유입될 경우,
                  아이슬란드 사례와 동일하게 한국·일본 항공 노선이 전면 중단될 수 있습니다.
                  인천국제공항 마비는 수출입 물류, 반도체 공급망, 관광·서비스업 전반에
                  연쇄적 경제 충격을 가져올 수 있습니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
