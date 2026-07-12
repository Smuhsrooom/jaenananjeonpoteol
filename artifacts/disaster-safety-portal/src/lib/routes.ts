/** 사이트 페이지 구분 */

export const ROUTES = [
  { path: "/", labelKey: "nav.home", key: "home" },
  { path: "/live", labelKey: "nav.live", key: "live", live: true },
  { path: "/alerts", labelKey: "nav.alerts", key: "alerts" },
  { path: "/simulation", labelKey: "nav.simulation", key: "simulation" },
  { path: "/guidelines", labelKey: "nav.guidelines", key: "guidelines" },
  { path: "/definition", labelKey: "nav.definition", key: "definition" },
  { path: "/system", labelKey: "nav.system", key: "system" },
  { path: "/impact", labelKey: "nav.impact", key: "impact" },
  { path: "/contacts", labelKey: "nav.contacts", key: "contacts" },
] as const;

export type AppRoute = (typeof ROUTES)[number];
export type RouteKey = AppRoute["key"];

/** 상단 바에 바로 보이는 주요 메뉴 */
export const PRIMARY_ROUTES: AppRoute[] = [
  ROUTES[0], // home
  ROUTES[1], // live
  ROUTES[2], // alerts
  ROUTES[3], // simulation
  ROUTES[4], // guidelines
];

/** 「더보기」에 묶는 보조 메뉴 */
export const MORE_ROUTES: AppRoute[] = [
  ROUTES[5], // definition
  ROUTES[6], // system
  ROUTES[7], // impact
  ROUTES[8], // contacts
];

export function matchRouteKey(pathname: string): RouteKey {
  const clean = pathname.replace(/\/$/, "") || "/";
  const hit = ROUTES.find((r) => r.path === clean);
  if (hit) return hit.key;
  if (clean.startsWith("/live")) return "live";
  if (clean.startsWith("/simulation")) return "simulation";
  return "home";
}
