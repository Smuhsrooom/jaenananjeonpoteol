/** 사이트 페이지 구분 */

export const ROUTES = [
  { path: "/", labelKey: "nav.home", key: "home" },
  { path: "/definition", labelKey: "nav.definition", key: "definition" },
  { path: "/system", labelKey: "nav.system", key: "system" },
  { path: "/alerts", labelKey: "nav.alerts", key: "alerts" },
  { path: "/guidelines", labelKey: "nav.guidelines", key: "guidelines" },
  { path: "/impact", labelKey: "nav.impact", key: "impact" },
  { path: "/live", labelKey: "nav.live", key: "live", live: true },
  { path: "/contacts", labelKey: "nav.contacts", key: "contacts" },
] as const;

export type RouteKey = (typeof ROUTES)[number]["key"];

export function matchRouteKey(pathname: string): RouteKey {
  const clean = pathname.replace(/\/$/, "") || "/";
  const hit = ROUTES.find((r) => r.path === clean);
  if (hit) return hit.key;
  if (clean.startsWith("/live")) return "live";
  return "home";
}
