export function formatKst(
  iso: string | null | undefined,
  opts?: Intl.DateTimeFormatOptions,
): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("ko-KR", {
      timeZone: "Asia/Seoul",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      ...opts,
    });
  } catch {
    return iso;
  }
}

export function magnitudeColor(mt: number) {
  if (mt >= 7.0) return "text-red-600";
  if (mt >= 5.5) return "text-orange-500";
  if (mt >= 4.0) return "text-yellow-600";
  return "text-blue-600";
}

export function magnitudeBg(mt: number) {
  if (mt >= 7.0) return "bg-red-50 border-red-300";
  if (mt >= 5.5) return "bg-orange-50 border-orange-300";
  if (mt >= 4.0) return "bg-yellow-50 border-yellow-300";
  return "bg-blue-50 border-blue-300";
}
