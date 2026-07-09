/** 위기경보 4단계 — 행안부 매뉴얼 기준 */

export type AlertLevelId = "interest" | "caution" | "alert" | "serious";

export interface AlertLevel {
  id: AlertLevelId;
  nameKo: string;
  nameEn: string;
  color: string;
  bgClass: string;
  textClass: string;
  badgeClass: string;
  borderClass: string;
  description: string;
  citizenAction: string;
  /** 배너: 현재 위기경보: ○○ — 국민 여러분께서는 ○○ 해 주세요 */
  bannerLine: string;
  situationReport: string;
  example: string;
}

export const ALERT_LEVELS: AlertLevel[] = [
  {
    id: "interest",
    nameKo: "관심",
    nameEn: "Blue",
    color: "#1565C0",
    bgClass: "bg-[#1565C0]",
    textClass: "text-[#1565C0]",
    badgeClass: "bg-blue-100 text-blue-800",
    borderClass: "border-blue-300",
    description: "위기 징후를 감시하는 단계",
    citizenAction: "공식 발표를 확인하고, 비상용품·행동요령을 미리 숙지하세요.",
    bannerLine:
      "현재 위기경보: 관심 — 국민 여러분께서는 공식 정보를 확인하며 상황을 지켜봐 주시기 바랍니다.",
    situationReport:
      "백두산 천지 주변에서 화산성 지진이 평소보다 자주 관측되기 시작했다. 아직 뚜렷한 지표 변화는 없다.",
    example: "징후 감시 · 정보 확인",
  },
  {
    id: "caution",
    nameKo: "주의",
    nameEn: "Yellow",
    color: "#F9A825",
    bgClass: "bg-[#F9A825]",
    textClass: "text-amber-800",
    badgeClass: "bg-amber-100 text-amber-900",
    borderClass: "border-amber-300",
    description: "위기 징후가 뚜렷해 협조 체계를 점검하는 단계",
    citizenAction: "가족 연락 방법을 정하고, 마스크·비상식량 등 준비물을 점검하세요.",
    bannerLine:
      "현재 위기경보: 주의 — 국민 여러분께서는 준비물을 점검하고 공식 안내에 귀 기울여 주시기 바랍니다.",
    situationReport:
      "지진이 급격히 늘고 산 표면이 부풀어 오르는 것이 확인되어, 관계 기관이 협조 체계를 점검하기 시작했다.",
    example: "협조 체계 점검 · 준비물",
  },
  {
    id: "alert",
    nameKo: "경계",
    nameEn: "Orange",
    color: "#EF6C00",
    bgClass: "bg-[#EF6C00]",
    textClass: "text-orange-800",
    badgeClass: "bg-orange-100 text-orange-900",
    borderClass: "border-orange-400",
    description: "위기 발생 가능성이 높아 대비 태세에 돌입하는 단계",
    citizenAction: "대피 경로를 확인하고, 불필요한 외출을 줄이며 지자체 안내에 따르세요.",
    bannerLine:
      "현재 위기경보: 경계 — 국민 여러분께서는 대피를 준비하고 불필요한 외출을 자제해 주시기 바랍니다.",
    situationReport:
      "분화가 임박했다는 분석이 나와 인근 지역 주민 대피 준비와 항공 운항 조정 검토에 들어갔다.",
    example: "대피 준비 · 외출 자제",
  },
  {
    id: "serious",
    nameKo: "심각",
    nameEn: "Red",
    color: "#C62828",
    bgClass: "bg-[#C62828]",
    textClass: "text-red-800",
    badgeClass: "bg-red-100 text-red-900",
    borderClass: "border-red-400",
    description: "위기가 발생했거나 확실시되는 단계",
    citizenAction: "실내에 머무르고 창문을 밀폐하세요. SNS가 아닌 공식 안내만 따르세요.",
    bannerLine:
      "현재 위기경보: 심각 — 국민 여러분께서는 실내 대기·창문 밀폐 후 공식 안내만 따라 주시기 바랍니다.",
    situationReport:
      "오늘 새벽 백두산이 분화를 시작했다. 화산재 기둥이 상공으로 치솟고 있다.",
    example: "전면 대응 · 공식 안내만",
  },
];

export function getAlertLevel(id: AlertLevelId): AlertLevel {
  return ALERT_LEVELS.find((l) => l.id === id) ?? ALERT_LEVELS[0];
}

export function suggestAlertFromLive(opts: {
  maxMagnitude?: number | null;
  volcanoAlertLabel?: string | null;
}): AlertLevelId {
  const mag = opts.maxMagnitude ?? 0;
  const label = opts.volcanoAlertLabel ?? "";
  if (/경보|심각|긴급/.test(label) || mag >= 6) return "serious";
  if (/주의|특보|경계/.test(label) || mag >= 5) return "alert";
  if (mag >= 4) return "caution";
  if (mag >= 3 || /정보|화산/.test(label)) return "interest";
  return "interest";
}
