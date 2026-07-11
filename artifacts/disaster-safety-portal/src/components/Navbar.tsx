import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Shield } from "lucide-react";
import { ROUTES } from "@/lib/routes";
import { useI18n } from "@/i18n/I18nContext";
import { useAlertLevel } from "@/context/AlertLevelContext";

interface NavbarProps {
  activeKey: string;
}

export default function Navbar({ activeKey }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const [, setLocation] = useLocation();
  const { t, locale, setLocale } = useI18n();
  const { level } = useAlertLevel();

  const go = (path: string) => {
    setLocation(path);
    setOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      className="border-b bg-white/95 backdrop-blur-sm transition-colors duration-300"
      style={{ borderColor: `${level.color}55` }}
    >
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-2 px-4 py-2.5 sm:px-6">
        <Link
          href="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <div
            className="shrink-0 rounded-lg p-1.5 text-white transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: level.color }}
          >
            <Shield size={16} />
          </div>
          <div className="min-w-0 text-left">
            <p
              className="truncate text-base font-black leading-tight sm:text-lg"
              style={{ color: level.inkColor }}
            >
              {t("brand.name")}
            </p>
            <p className="mt-1 truncate text-sm text-slate-600">{t("brand.tagline")}</p>
          </div>
        </Link>

        <ul className="hidden items-center gap-0.5 lg:flex">
          {ROUTES.map((item) => {
            const active = activeKey === item.key;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className={`relative inline-flex items-center rounded-lg px-3 py-2 text-base font-semibold transition-all duration-200 ${
                    active ? "" : "text-slate-700 hover:bg-slate-50"
                  }`}
                  style={
                    active
                      ? {
                          backgroundColor: level.softColor,
                          color: level.inkColor,
                          boxShadow: `inset 0 -2px 0 ${level.color}`,
                        }
                      : undefined
                  }
                >
                  {"live" in item && item.live && (
                    <span className="mr-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                  {t(item.labelKey)}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex shrink-0 items-center gap-1">
          <div
            className="flex overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-sm font-bold"
            role="group"
            aria-label={t("nav.langAria")}
          >
            <button
              type="button"
              onClick={() => setLocale("ko")}
              className={`rounded-md px-2 py-1 transition ${
                locale === "ko" ? "text-white shadow-sm" : "text-slate-500"
              }`}
              style={locale === "ko" ? { backgroundColor: level.color } : undefined}
            >
              {t("nav.langKo")}
            </button>
            <button
              type="button"
              onClick={() => setLocale("en")}
              className={`rounded-md px-2 py-1 transition ${
                locale === "en" ? "text-white shadow-sm" : "text-slate-500"
              }`}
              style={locale === "en" ? { backgroundColor: level.color } : undefined}
            >
              {t("nav.langEn")}
            </button>
          </div>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={t("nav.menu")}
            aria-expanded={open}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <div
        className={`nav-mobile overflow-hidden border-t border-slate-100 lg:hidden ${
          open ? "nav-mobile--open" : "nav-mobile--closed"
        }`}
      >
        <div className="px-2 py-2">
          {ROUTES.map((item, i) => {
            const active = activeKey === item.key;
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => go(item.path)}
                className={`nav-mobile__item block w-full rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-all duration-200 ${
                  active ? "" : "text-slate-600 hover:bg-slate-50"
                }`}
                style={{
                  transitionDelay: open ? `${40 + i * 30}ms` : "0ms",
                  ...(active
                    ? { backgroundColor: level.softColor, color: level.inkColor }
                    : {}),
                }}
              >
                {t(item.labelKey)}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
