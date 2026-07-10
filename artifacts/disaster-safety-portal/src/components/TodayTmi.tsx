import { useMemo } from "react";
import { Lightbulb, Sparkles } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import { useT } from "@/i18n/I18nContext";

const TMI_COUNT = 12;

export default function TodayTmi() {
  const t = useT();
  /** 새로고침할 때마다 랜덤 */
  const index = useMemo(() => Math.floor(Math.random() * TMI_COUNT), []);
  const n = index + 1;

  const title = `${t("tmi.prefix")}${t(`tmi.t${n}Title`)}`;
  const body = t(`tmi.t${n}Body`);

  return (
    <section className="border-b border-slate-200 bg-gradient-to-b from-[#FAFBFC] to-white py-10 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-[#0B2B66]/15 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 bg-[#0B2B66] px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2 text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                  <Lightbulb size={18} />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-200/90">
                    {t("tmi.eyebrow")}
                  </p>
                  <h2 className="text-base font-black sm:text-lg">{t("tmi.title")}</h2>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-300/20 px-2.5 py-1 text-xs font-semibold text-amber-100">
                <Sparkles size={12} />
                {t("tmi.badge", { n: String(n) })}
              </span>
            </div>
            <div className="px-4 py-5 sm:px-6 sm:py-6">
              <p className="text-lg font-black leading-snug text-[#0B2B66] sm:text-xl">
                {title}
              </p>
              <p className="mt-3 text-base leading-relaxed text-slate-700">{body}</p>
              <p className="mt-4 text-sm text-slate-500">{t("tmi.footer")}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
