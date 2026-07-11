/** 위기경보 4단계 — 행안부 매뉴얼 기준 */

export type AlertLevelId = "interest" | "caution" | "alert" | "serious";

export interface AlertLevel {
  id: AlertLevelId;
  /** @deprecated use i18n alert.{id}.name */
  nameKo: string;
  nameEn: string;
  color: string;
  /** 페이지 배경 tint */
  softColor: string;
  /** 강조 텍스트에 쓰기 좋은 어두운 톤 */
  inkColor: string;
  bgClass: string;
  textClass: string;
  badgeClass: string;
  borderClass: string;
  /** visual shell only — text from i18n */
  description: string;
  citizenAction: string;
  bannerLine: string;
  situationReport: string;
  example: string;
}

/** Style + id only; display strings come from i18n (`alert.{id}.*`) */
export const ALERT_LEVELS: AlertLevel[] = [
  {
    id: "interest",
    nameKo: "관심",
    nameEn: "Blue",
    color: "#1565C0",
    softColor: "#E3F2FD",
    inkColor: "#0D47A1",
    bgClass: "bg-[#1565C0]",
    textClass: "text-[#1565C0]",
    badgeClass: "bg-blue-100 text-blue-800",
    borderClass: "border-blue-300",
    description: "",
    citizenAction: "",
    bannerLine: "",
    situationReport: "",
    example: "",
  },
  {
    id: "caution",
    nameKo: "주의",
    nameEn: "Yellow",
    color: "#F9A825",
    softColor: "#FFF8E1",
    inkColor: "#F57F17",
    bgClass: "bg-[#F9A825]",
    textClass: "text-amber-800",
    badgeClass: "bg-amber-100 text-amber-900",
    borderClass: "border-amber-300",
    description: "",
    citizenAction: "",
    bannerLine: "",
    situationReport: "",
    example: "",
  },
  {
    id: "alert",
    nameKo: "경계",
    nameEn: "Orange",
    color: "#EF6C00",
    softColor: "#FFF3E0",
    inkColor: "#E65100",
    bgClass: "bg-[#EF6C00]",
    textClass: "text-orange-800",
    badgeClass: "bg-orange-100 text-orange-900",
    borderClass: "border-orange-400",
    description: "",
    citizenAction: "",
    bannerLine: "",
    situationReport: "",
    example: "",
  },
  {
    id: "serious",
    nameKo: "심각",
    nameEn: "Red",
    color: "#C62828",
    softColor: "#FFEBEE",
    inkColor: "#B71C1C",
    bgClass: "bg-[#C62828]",
    textClass: "text-red-800",
    badgeClass: "bg-red-100 text-red-900",
    borderClass: "border-red-400",
    description: "",
    citizenAction: "",
    bannerLine: "",
    situationReport: "",
    example: "",
  },
];

export type AlertTextKey =
  | "name"
  | "nameEn"
  | "description"
  | "citizenAction"
  | "bannerLine"
  | "situationReport"
  | "example";

export function alertTextKey(id: AlertLevelId, field: AlertTextKey): string {
  return `alert.${id}.${field}`;
}

export function getAlertLevel(id: AlertLevelId): AlertLevel {
  return ALERT_LEVELS.find((l) => l.id === id) ?? ALERT_LEVELS[0];
}

/** 관측 제안 단계 — 기본은 항상 관심(Blue) */
export function suggestAlertFromLive(_opts?: {
  maxMagnitude?: number | null;
  volcanoAlertLabel?: string | null;
}): AlertLevelId {
  return "interest";
}
