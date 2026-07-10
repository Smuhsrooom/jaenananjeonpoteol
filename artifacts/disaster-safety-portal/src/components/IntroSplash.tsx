import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { useT } from "@/i18n/I18nContext";

const INTRO_MS = 2600;
const EXIT_AT_MS = 1900;
const SESSION_KEY = "ndsc-intro-seen";

export function shouldPlayIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (sessionStorage.getItem(SESSION_KEY) === "1") return false;
  } catch {
    /* ignore */
  }
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  } catch {
    /* ignore */
  }
  return true;
}

function markIntroSeen() {
  try {
    sessionStorage.setItem(SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

export default function IntroSplash({ onFinished }: { onFinished?: () => void }) {
  const t = useT();
  const [active, setActive] = useState(() => shouldPlayIntro());
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    if (!active) {
      onFinished?.();
      return;
    }

    const tExit = window.setTimeout(() => setExiting(true), EXIT_AT_MS);
    const tDone = window.setTimeout(() => {
      markIntroSeen();
      setActive(false);
      onFinished?.();
    }, INTRO_MS);

    return () => {
      window.clearTimeout(tExit);
      window.clearTimeout(tDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!active) return null;

  return (
    <div
      className={`intro-splash fixed inset-0 z-[200] flex items-center justify-center overflow-hidden ${
        exiting ? "intro-splash--exit" : ""
      }`}
      role="presentation"
      aria-hidden="true"
    >
      <div className="intro-splash__bg absolute inset-0" />
      <div className="intro-splash__grid absolute inset-0 opacity-30" />
      <div className="intro-splash__glow absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="intro-splash__rings absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="intro-splash__ring" />
        <span className="intro-splash__ring intro-splash__ring--2" />
        <span className="intro-splash__ring intro-splash__ring--3" />
      </div>

      <div className="intro-splash__content relative z-10 flex flex-col items-center px-6 text-center">
        <div className="intro-splash__badge mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/25 backdrop-blur-sm">
          <Shield className="intro-splash__icon h-8 w-8 text-white" strokeWidth={1.75} />
        </div>

        <p className="intro-splash__eyebrow mb-2 text-sm font-bold uppercase tracking-[0.28em] text-sky-200/90">
          {t("intro.enTitle")}
        </p>
        <h1 className="intro-splash__title text-2xl font-black tracking-tight text-white sm:text-3xl">
          {t("intro.title")}
        </h1>
        <p className="intro-splash__sub mt-3 max-w-sm text-sm font-medium text-sky-100/80">
          {t("intro.sub")}
        </p>

        <div className="intro-splash__bar mt-8 h-0.5 w-28 overflow-hidden rounded-full bg-white/15">
          <span className="intro-splash__bar-fill block h-full w-full origin-left bg-gradient-to-r from-sky-300 to-white" />
        </div>
      </div>
    </div>
  );
}
