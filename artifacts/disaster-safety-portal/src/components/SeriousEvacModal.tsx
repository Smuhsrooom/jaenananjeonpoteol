import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  X,
  ShieldAlert,
  Wind,
  Home,
  Eye,
  Droplets,
  Wheat,
  Radio,
  Car,
  type LucideIcon,
} from "lucide-react";
import { useAlertLevel } from "@/context/AlertLevelContext";
import { useT } from "@/i18n/I18nContext";

const EVAC_CARDS: { icon: LucideIcon; titleKey: string; bodyKey: string }[] = [
  { icon: Wind, titleKey: "seriousModal.c1t", bodyKey: "seriousModal.c1b" },
  { icon: Home, titleKey: "seriousModal.c2t", bodyKey: "seriousModal.c2b" },
  { icon: Eye, titleKey: "seriousModal.c3t", bodyKey: "seriousModal.c3b" },
  { icon: Droplets, titleKey: "seriousModal.c4t", bodyKey: "seriousModal.c4b" },
  { icon: Wheat, titleKey: "seriousModal.c5t", bodyKey: "seriousModal.c5b" },
  { icon: Radio, titleKey: "seriousModal.c6t", bodyKey: "seriousModal.c6b" },
  { icon: Car, titleKey: "seriousModal.c7t", bodyKey: "seriousModal.c7b" },
  { icon: ShieldAlert, titleKey: "seriousModal.c8t", bodyKey: "seriousModal.c8b" },
];

export default function SeriousEvacModal() {
  const { seriousModalOpen, closeSeriousModal, levelId } = useAlertLevel();
  const t = useT();

  useEffect(() => {
    if (!seriousModalOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSeriousModal();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [seriousModalOpen, closeSeriousModal]);

  if (!seriousModalOpen || levelId !== "serious") return null;
  if (typeof document === "undefined") return null;

  const modal = (
    <div
      className="serious-evac-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="serious-evac-title"
    >
      <button
        type="button"
        className="serious-evac-backdrop"
        aria-label={t("common.close")}
        onClick={closeSeriousModal}
      />

      <div className="serious-evac-panel">
        <div className="serious-evac-header">
          <div className="serious-evac-header-inner">
            <span className="serious-evac-icon">
              <AlertTriangle className="h-6 w-6 animate-pulse" strokeWidth={2.5} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-red-100">
                {t("seriousModal.badge")}
              </p>
              <h2
                id="serious-evac-title"
                className="mt-0.5 text-lg font-black leading-snug sm:text-2xl"
              >
                {t("seriousModal.title")}
              </h2>
              <p className="mt-1.5 text-xs leading-relaxed text-red-50 sm:text-sm">
                {t("seriousModal.lead")}
              </p>
            </div>
            <button
              type="button"
              onClick={closeSeriousModal}
              className="shrink-0 rounded-lg p-2 text-white/90 transition hover:bg-white/15"
              aria-label={t("common.close")}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        <div className="serious-evac-body">
          <h3 className="text-sm font-black text-red-900 sm:text-base">
            {t("seriousModal.sectionTitle")}
          </h3>
          <p className="mt-0.5 text-xs text-slate-600 sm:text-sm">{t("seriousModal.sectionDesc")}</p>

          <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">
            {EVAC_CARDS.map(({ icon: Icon, titleKey, bodyKey }) => (
              <li
                key={titleKey}
                className="flex gap-2.5 rounded-xl border border-red-100 bg-red-50/50 p-3 shadow-sm"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-600 text-white shadow-sm">
                  <Icon size={20} strokeWidth={2.2} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-black text-red-950">{t(titleKey)}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-700 sm:text-sm">
                    {t(bodyKey)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-950">
            {t("seriousModal.disclaimer")}
          </p>
        </div>

        <div className="shrink-0 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:px-6">
          <button
            type="button"
            onClick={closeSeriousModal}
            className="w-full rounded-xl bg-red-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-red-800 sm:text-base"
          >
            {t("seriousModal.ack")}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
