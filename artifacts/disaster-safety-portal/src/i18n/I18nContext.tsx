import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/i18n/types";
import { messages } from "@/i18n/messages";

const STORAGE_KEY = "ndsc-locale";

type Vars = Record<string, string | number>;

type I18nValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggleLocale: () => void;
  t: (key: string, vars?: Vars) => string;
  localeTag: string; // BCP 47 for Date
};

const I18nContext = createContext<I18nValue | null>(null);

function readStoredLocale(): Locale {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "en" || v === "ko") return v;
  } catch {
    /* ignore */
  }
  return "ko";
}

function getByPath(obj: unknown, path: string): unknown {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

function applyVars(s: string, vars?: Vars): string {
  if (!vars) return s;
  return s.replace(/\{(\w+)\}/g, (_, k: string) =>
    vars[k] != null ? String(vars[k]) : `{${k}}`,
  );
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(() =>
    typeof window !== "undefined" ? readStoredLocale() : "ko",
  );

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === "ko" ? "en" : "ko");
  }, [locale, setLocale]);

  useEffect(() => {
    document.documentElement.lang = locale === "ko" ? "ko" : "en";
  }, [locale]);

  const t = useCallback(
    (key: string, vars?: Vars) => {
      const raw = getByPath(messages[locale], key);
      if (typeof raw === "string") return applyVars(raw, vars);
      const fallback = getByPath(messages.ko, key);
      if (typeof fallback === "string") return applyVars(fallback, vars);
      return key;
    },
    [locale],
  );

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      toggleLocale,
      t,
      localeTag: locale === "ko" ? "ko-KR" : "en-US",
    }),
    [locale, setLocale, toggleLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function useT() {
  return useI18n().t;
}
