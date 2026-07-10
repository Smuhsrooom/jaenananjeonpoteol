import SectionHeader from "@/components/SectionHeader";
import SourceStamp from "@/components/SourceStamp";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import { Check, X } from "lucide-react";
import { useT } from "@/i18n/I18nContext";

export default function GuidelinesSection() {
  const t = useT();

  const GUIDES = [
    {
      where: t("guidelines.g1Where"),
      who: t("guidelines.g1Who"),
      when: t("guidelines.g1When"),
      what: t("guidelines.g1What"),
    },
    {
      where: t("guidelines.g2Where"),
      who: t("guidelines.g2Who"),
      when: t("guidelines.g2When"),
      what: t("guidelines.g2What"),
    },
    {
      where: t("guidelines.g3Where"),
      who: t("guidelines.g3Who"),
      when: t("guidelines.g3When"),
      what: t("guidelines.g3What"),
    },
    {
      where: t("guidelines.g4Where"),
      who: t("guidelines.g4Who"),
      when: t("guidelines.g4When"),
      what: t("guidelines.g4What"),
    },
  ];

  const REWRITES = [
    {
      bad: t("guidelines.r1Bad"),
      who: t("guidelines.r1Who"),
      when: t("guidelines.r1When"),
      what: t("guidelines.r1What"),
    },
    {
      bad: t("guidelines.r2Bad"),
      who: t("guidelines.r2Who"),
      when: t("guidelines.r2When"),
      what: t("guidelines.r2What"),
    },
    {
      bad: t("guidelines.r3Bad"),
      who: t("guidelines.r3Who"),
      when: t("guidelines.r3When"),
      what: t("guidelines.r3What"),
    },
  ];

  return (
    <section id="guidelines" className="border-b border-slate-200 bg-[#FAFBFC] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow={t("guidelines.eyebrow")}
          title={t("guidelines.title")}
          description={t("guidelines.description")}
          action={
            <a
              href="https://www.safekorea.go.kr/"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[#0B2B66] underline-offset-2 hover:underline"
            >
              {t("guidelines.portalLink")}
            </a>
          }
        />

        <Reveal className="mb-5 flex flex-wrap items-center gap-2">
          {[t("guidelines.who"), t("guidelines.when"), t("guidelines.what")].map((label) => (
            <span
              key={label}
              className="rounded-full bg-[#0B2B66] px-3 py-1 text-sm font-bold text-white"
            >
              {label}
            </span>
          ))}
          <SourceStamp source={t("guidelines.stamp")} className="ml-1" />
        </Reveal>

        <Reveal className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-4 py-3">
            <h3 className="text-lg font-black text-[#0B2B66]">{t("guidelines.rewriteTitle")}</h3>
            <p className="mt-0.5 text-sm text-slate-500">{t("guidelines.rewriteDesc")}</p>
          </div>
          <div className="divide-y divide-slate-100">
            {REWRITES.map((r) => (
              <div key={r.bad} className="grid gap-3 p-4 md:grid-cols-2">
                <div className="rounded-xl border border-red-100 bg-red-50/60 p-3">
                  <p className="mb-1 flex items-center gap-1 text-sm font-bold text-red-600">
                    <X size={12} /> {t("guidelines.badLabel")}
                  </p>
                  <p className="text-sm text-red-900/80">“{r.bad}”</p>
                </div>
                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3">
                  <p className="mb-1 flex items-center gap-1 text-sm font-bold text-emerald-700">
                    <Check size={12} /> {t("guidelines.goodLabel")}
                  </p>
                  <dl className="space-y-1 text-sm text-emerald-950/90">
                    <div className="flex gap-2">
                      <dt className="w-10 shrink-0 font-bold text-emerald-700/70">
                        {t("guidelines.who")}
                      </dt>
                      <dd>{r.who}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-10 shrink-0 font-bold text-emerald-700/70">
                        {t("guidelines.when")}
                      </dt>
                      <dd>{r.when}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-10 shrink-0 font-bold text-emerald-700/70">
                        {t("guidelines.what")}
                      </dt>
                      <dd className="leading-relaxed">{r.what}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Stagger className="grid gap-3 md:grid-cols-2">
          {GUIDES.map((g) => (
            <article
              key={g.where}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <h3 className="text-lg font-black text-[#0B2B66]">{g.where}</h3>
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex gap-2">
                  <dt className="w-10 shrink-0 font-bold text-slate-400">{t("guidelines.who")}</dt>
                  <dd className="text-slate-800">{g.who}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-10 shrink-0 font-bold text-slate-400">{t("guidelines.when")}</dt>
                  <dd className="text-slate-800">{g.when}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="w-10 shrink-0 font-bold text-slate-400">{t("guidelines.what")}</dt>
                  <dd className="leading-relaxed text-slate-800">{g.what}</dd>
                </div>
              </dl>
            </article>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
