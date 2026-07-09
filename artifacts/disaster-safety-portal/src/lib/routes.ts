/** 사이트 페이지 구분 */

export const ROUTES = [
  { path: "/", label: "현황", key: "home" },
  { path: "/definition", label: "재난 정의", key: "definition" },
  { path: "/system", label: "관리 체계", key: "system" },
  { path: "/alerts", label: "위기경보", key: "alerts" },
  { path: "/guidelines", label: "행동요령", key: "guidelines" },
  { path: "/impact", label: "영향 브리핑", key: "impact" },
  { path: "/live", label: "실시간", key: "live", live: true },
  { path: "/contacts", label: "연락처", key: "contacts" },
] as const;

export type RouteKey = (typeof ROUTES)[number]["key"];

export function matchRouteKey(pathname: string): RouteKey {
  const clean = pathname.replace(/\/$/, "") || "/";
  const hit = ROUTES.find((r) => r.path === clean);
  if (hit) return hit.key;
  if (clean.startsWith("/live")) return "live";
  return "home";
}
