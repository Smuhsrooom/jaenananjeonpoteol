/** 위기경보 4단계 — 행안부 매뉴얼 기준 */

export type AlertLevelId = "interest" | "caution" | "alert" | "serious";

export interface AlertLevel {
  id: AlertLevelId;
  /** @deprecated use i18n alert.{id}.name */
  nameKo: string;
  nameEn: string;
  color: string;
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
