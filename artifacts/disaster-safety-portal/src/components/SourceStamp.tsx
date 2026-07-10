import { useI18n } from "@/i18n/I18nContext";

/** 공신력 스탬프 — 출처·갱신 시각 */

export default function SourceStamp({
  source,
  updatedAt,
  className = "",
}: {
  source: string;
  updatedAt?: Date | string | null;
  className?: string;
}) {
  const { localeTag } = useI18n();
  let time = "";
  if (updatedAt) {
    const d = typeof updatedAt === "string" ? new Date(updatedAt) : updatedAt;
    time = d.toLocaleString(localeTag, {
      timeZone: "Asia/Seoul",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-0.5 text-sm font-semibold text-slate-600 ${className}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-[#0B2B66]" />
      {source}
      {time ? <span className="font-normal text-slate-400">· {time}</span> : null}
    </span>
  );
}
