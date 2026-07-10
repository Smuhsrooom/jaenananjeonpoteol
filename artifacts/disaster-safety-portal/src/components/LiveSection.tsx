import { AlertTriangle } from "lucide-react";
import VolcanoListSection from "@/components/VolcanoListSection";
import EarthquakeListSection from "@/components/EarthquakeListSection";
import Reveal from "@/components/motion/Reveal";
import { useT } from "@/i18n/I18nContext";

export default function LiveSection() {
  const t = useT();

  return (
    <div id="live">
      <div className="border-b border-slate-100 bg-[#0B2B66] px-4 py-8 sm:px-6">
        <div className="hero-enter mx-auto max-w-7xl">
          <p
            className="hero-enter__item text-sm font-bold uppercase tracking-[0.2em] text-blue-200/70"
            style={{ ["--i" as string]: 0 }}
          >
            {t("live.eyebrow")}
          </p>
          <h2
            className="hero-enter__item mt-2 text-2xl font-black text-white md:text-3xl"
            style={{ ["--i" as string]: 1 }}
          >
            {t("live.title")}
          </h2>
          <p
            className="hero-enter__item mt-2 max-w-2xl text-sm leading-relaxed text-blue-100/90"
            style={{ ["--i" as string]: 2 }}
          >
            {t("live.leadBefore")} <strong className="text-white">{t("live.leadStrong")}</strong>
            {t("live.leadAfter")}
          </p>
          <div
            className="hero-enter__item mt-4 flex gap-3 rounded-xl border border-amber-300/40 bg-amber-500/15 px-4 py-3 text-amber-50"
            style={{ ["--i" as string]: 3 }}
          >
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-200" />
            <div className="text-sm leading-relaxed sm:text-sm">
              <p className="font-black text-amber-100">{t("live.noticeTitle")}</p>
              <p className="mt-1 text-amber-50/95">
                {t("live.noticeBodyBefore")}{" "}
                <strong>{t("live.noticeStrong")}</strong>
                {t("live.noticeBodyAfter")}
              </p>
            </div>
          </div>
          <div
            className="hero-enter__item mt-3 flex flex-wrap gap-2"
            style={{ ["--i" as string]: 4 }}
          >
            {[t("live.tag1"), t("live.tag2"), t("live.tag3")].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 bg-white/10 px-2.5 py-0.5 text-sm font-semibold text-white"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Reveal>
        <VolcanoListSection />
      </Reveal>
      <Reveal>
        <EarthquakeListSection />
      </Reveal>
    </div>
  );
}
