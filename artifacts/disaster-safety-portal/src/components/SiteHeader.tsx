import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  Shield,
  AlertTriangle,
  ChevronDown,
  Activity,
  Minus,
  Plus,
} from "lucide-react";
import { PRIMARY_ROUTES, MORE_ROUTES, type AppRoute } from "@/lib/routes";
import { useI18n } from "@/i18n/I18nContext";
import { useAlertLevel } from "@/context/AlertLevelContext";
import { useEarthquake, useLatestEarthquake } from "@/context/EarthquakeContext";
import { useLatestVolcano } from "@/context/VolcanoContext";
import { alertTextKey } from "@/lib/alertLevels";
import { formatKst } from "@/lib/format";

interface SiteHeaderProps {
  activeKey: string;
}

const ZOOM_KEY = "ndsc-page-zoom";
const ZOOM_MIN = 0.85;
const ZOOM_MAX = 1.35;
const ZOOM_STEP = 0.1;
const ZOOM_DEFAULT = 1.1;

function readZoom(): number {
  try {
    const v = Number(localStorage.getItem(ZOOM_KEY));
    if (Number.isFinite(v) && v >= ZOOM_MIN && v <= ZOOM_MAX) return Math.round(v * 100) / 100;
  } catch {
    /* ignore */
  }
  return ZOOM_DEFAULT;
}

function applyZoom(z: number) {
  const root = document.documentElement;
  // 페이지 전체 확대·축소 (한 방식만 — 이중 스케일 방지)
  root.style.zoom = String(z);
  root.style.setProperty("--page-zoom", String(z));
}

function LiveClock({ localeTag }: { localeTag: string }) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="tabular-nums">
      {time.toLocaleTimeString(localeTag, {
        timeZone: "Asia/Seoul",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })}
    </span>
  );
}

export default function SiteHeader({ activeKey }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [zoom, setZoom] = useState(ZOOM_DEFAULT);
  const moreRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const { t, locale, setLocale, localeTag } = useI18n();
  const { level, openSeriousModal } = useAlertLevel();
  const { loading: eqLoading, lastRefresh } = useEarthquake();
  const latestEq = useLatestEarthquake();
  const latestVol = useLatestVolcano();

  useEffect(() => {
    const z = readZoom();
    setZoom(z);
    applyZoom(z);
  }, []);

  const changeZoom = (next: number) => {
    const z = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(next * 100) / 100));
    setZoom(z);
    applyZoom(z);
    try {
      localStorage.setItem(ZOOM_KEY, String(z));
    } catch {
      /* ignore */
    }
  };

  const isLight = level.id === "caution";
  const fg = isLight ? "#1a1a1a" : "#ffffff";
  const name = t(alertTextKey(level.id, "name"));
  const nameEn = t(alertTextKey(level.id, "nameEn"));
  const line = t(alertTextKey(level.id, "bannerLine"));
  const moreActive = MORE_ROUTES.some((r) => r.key === activeKey);

  const go = (path: string) => {
    setLocation(path);
    setMenuOpen(false);
    setMoreOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (!moreOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [moreOpen]);

  const linkClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[15px] font-semibold transition ${
      active ? "" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  const linkStyle = (active: boolean) =>
    active
      ? {
          backgroundColor: level.softColor,
          color: level.inkColor,
          boxShadow: `inset 0 -2px 0 ${level.color}`,
        }
      : undefined;

  const renderNavLink = (item: AppRoute, onClick?: () => void) => {
    const active = activeKey === item.key;
    return (
      <Link
        key={item.path}
        href={item.path}
        onClick={() => {
          onClick?.();
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        className={linkClass(active)}
        style={linkStyle(active)}
      >
        {"live" in item && item.live && (
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        )}
        {t(item.labelKey)}
      </Link>
    );
  };

  const liveBits = [
    latestVol
      ? `${t("common.volcano")} ${latestVol.volcanoName ?? "—"}`
      : null,
    latestEq ? `${t("common.earthquake")} M${latestEq.magnitude.toFixed(1)}` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      {/* ── 경보 한 줄 ── */}
      <div
        data-testid="alert-banner"
        className="transition-colors duration-300"
        style={{ backgroundColor: level.color, color: fg }}
        role="status"
        aria-live="polite"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-3 py-2 sm:px-5">
          <AlertTriangle
            size={16}
            className={`shrink-0 ${level.id === "serious" ? "animate-pulse" : ""}`}
            strokeWidth={2.5}
          />
          <span
            className="shrink-0 rounded-md px-2 py-0.5 text-[11px] font-black tracking-wide sm:text-xs"
            style={{
              backgroundColor: isLight ? "rgba(0,0,0,.12)" : "rgba(255,255,255,.92)",
              color: isLight ? fg : "#0f172a",
            }}
          >
            {name}
            <span className="hidden sm:inline"> · {nameEn}</span>
          </span>
          <p className="min-w-0 flex-1 truncate text-sm font-semibold sm:text-[15px]">{line}</p>
          {liveBits && (
            <p className="hidden max-w-[28%] truncate text-xs opacity-90 lg:block">
              {liveBits}
            </p>
          )}
          <span className="hidden items-center gap-1.5 text-xs opacity-85 md:inline-flex">
            <Activity size={13} className={eqLoading ? "animate-spin" : ""} />
            <LiveClock localeTag={localeTag} />
            {lastRefresh && (
              <span className="opacity-70">
                ·{" "}
                {lastRefresh.toLocaleTimeString(localeTag, {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            )}
          </span>
          {level.id === "serious" && (
            <button
              type="button"
              onClick={openSeriousModal}
              className="shrink-0 rounded-lg bg-white px-2.5 py-1.5 text-xs font-bold text-red-800 shadow-sm hover:bg-red-50"
            >
              {t("seriousModal.openCta")}
            </button>
          )}
        </div>
      </div>

      {/* ── 메인 내비 ── */}
      <nav className="border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2.5 px-3 sm:h-16 sm:gap-3 sm:px-5">
          <Link
            href="/"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex min-w-0 shrink-0 items-center gap-2.5"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl text-white sm:h-10 sm:w-10"
              style={{ backgroundColor: level.color }}
            >
              <Shield size={18} />
            </span>
            <span
              className="truncate text-base font-black sm:text-lg"
              style={{ color: level.inkColor }}
            >
              {t("brand.name")}
            </span>
          </Link>

          <div className="mx-1 hidden h-6 w-px bg-slate-200 lg:block" />

          {/* 데스크톱: 주요 메뉴 + 더보기 */}
          <div className="hidden min-w-0 flex-1 items-center gap-1 lg:flex">
            {PRIMARY_ROUTES.map((item) => renderNavLink(item))}

            <div className="relative" ref={moreRef}>
              <button
                type="button"
                onClick={() => setMoreOpen((v) => !v)}
                className={linkClass(moreActive || moreOpen)}
                style={linkStyle(moreActive || moreOpen)}
                aria-expanded={moreOpen}
              >
                {t("nav.more")}
                <ChevronDown
                  size={16}
                  className={`transition ${moreOpen ? "rotate-180" : ""}`}
                />
              </button>
              {moreOpen && (
                <div className="absolute left-0 top-full z-50 mt-1.5 min-w-[11.5rem] overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
                  {MORE_ROUTES.map((item) => {
                    const active = activeKey === item.key;
                    return (
                      <button
                        key={item.path}
                        type="button"
                        onClick={() => go(item.path)}
                        className="block w-full px-3.5 py-2.5 text-left text-[15px] font-semibold transition hover:bg-slate-50"
                        style={
                          active
                            ? { backgroundColor: level.softColor, color: level.inkColor }
                            : { color: "#334155" }
                        }
                      >
                        {t(item.labelKey)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <div
              className="flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold sm:text-sm"
              role="group"
              aria-label={t("nav.langAria")}
            >
              <button
                type="button"
                onClick={() => setLocale("ko")}
                className={`rounded-md px-2.5 py-1.5 transition ${
                  locale === "ko" ? "text-white shadow-sm" : "text-slate-500"
                }`}
                style={locale === "ko" ? { backgroundColor: level.color } : undefined}
              >
                {t("nav.langKo")}
              </button>
              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`rounded-md px-2.5 py-1.5 transition ${
                  locale === "en" ? "text-white shadow-sm" : "text-slate-500"
                }`}
                style={locale === "en" ? { backgroundColor: level.color } : undefined}
              >
                {t("nav.langEn")}
              </button>
            </div>

            {/* 확대/축소 — 한·영 옆 */}
            <div
              className="flex items-center overflow-hidden rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-600 sm:text-sm"
              role="group"
              aria-label={t("nav.zoomAria")}
            >
              <button
                type="button"
                onClick={() => changeZoom(zoom - ZOOM_STEP)}
                disabled={zoom <= ZOOM_MIN}
                className="flex h-8 w-8 items-center justify-center transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 sm:h-9 sm:w-9"
                aria-label={t("nav.zoomOut")}
                title={t("nav.zoomOut")}
              >
                <Minus size={15} strokeWidth={2.5} />
              </button>
              <button
                type="button"
                onClick={() => changeZoom(ZOOM_DEFAULT)}
                className="min-w-[2.75rem] border-x border-slate-200 px-1.5 py-1.5 tabular-nums text-slate-700 hover:bg-slate-100 sm:min-w-[3rem]"
                title={t("nav.zoomReset")}
                aria-label={t("nav.zoomReset")}
              >
                {Math.round(zoom * 100)}%
              </button>
              <button
                type="button"
                onClick={() => changeZoom(zoom + ZOOM_STEP)}
                disabled={zoom >= ZOOM_MAX}
                className="flex h-8 w-8 items-center justify-center transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35 sm:h-9 sm:w-9"
                aria-label={t("nav.zoomIn")}
                title={t("nav.zoomIn")}
              >
                <Plus size={15} strokeWidth={2.5} />
              </button>
            </div>

            <button
              type="button"
              className="rounded-lg p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={t("nav.menu")}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* 모바일 전체 메뉴 */}
        <div
          className={`nav-mobile overflow-hidden border-t border-slate-100 lg:hidden ${
            menuOpen ? "nav-mobile--open" : "nav-mobile--closed"
          }`}
        >
          <div className="max-h-[70vh] space-y-0.5 overflow-y-auto px-2 py-2">
            <p className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t("nav.primary")}
            </p>
            {PRIMARY_ROUTES.map((item, i) => {
              const active = activeKey === item.key;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => go(item.path)}
                  className="nav-mobile__item block w-full rounded-lg px-3 py-3 text-left text-base font-semibold"
                  style={{
                    transitionDelay: menuOpen ? `${30 + i * 25}ms` : "0ms",
                    ...(active
                      ? { backgroundColor: level.softColor, color: level.inkColor }
                      : { color: "#475569" }),
                  }}
                >
                  {"live" in item && item.live && (
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  )}
                  {t(item.labelKey)}
                </button>
              );
            })}
            <p className="mt-2 px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              {t("nav.more")}
            </p>
            {MORE_ROUTES.map((item, i) => {
              const active = activeKey === item.key;
              return (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => go(item.path)}
                  className="nav-mobile__item block w-full rounded-lg px-3 py-3 text-left text-base font-semibold"
                  style={{
                    transitionDelay: menuOpen
                      ? `${30 + (PRIMARY_ROUTES.length + i) * 25}ms`
                      : "0ms",
                    ...(active
                      ? { backgroundColor: level.softColor, color: level.inkColor }
                      : { color: "#475569" }),
                  }}
                >
                  {t(item.labelKey)}
                </button>
              );
            })}
            {latestVol && (
              <p className="mt-2 truncate px-3 py-1 text-[11px] text-slate-500">
                {t("common.volcano")}: {latestVol.volcanoName}
                {latestVol.plumeHeightKm != null ? ` · ${latestVol.plumeHeightKm}km` : ""}
                {latestVol.announcedAt
                  ? ` · ${formatKst(latestVol.announcedAt, undefined, localeTag)}`
                  : ""}
              </p>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
