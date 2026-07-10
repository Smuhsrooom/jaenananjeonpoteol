import SectionHeader from "@/components/SectionHeader";
import SourceStamp from "@/components/SourceStamp";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import { Check, X, Home, Wind, Car, Package, AlertTriangle } from "lucide-react";
import { useT } from "@/i18n/I18nContext";
import type { LucideIcon } from "lucide-react";

export default function GuidelinesSection() {
  const t = useT();

  const dos = [t("guidelines.do1"), t("guidelines.do2"), t("guidelines.do3"), t("guidelines.do4"), t("guidelines.do5")];
  const donts = [
    t("guidelines.dont1"),
    t("guidelines.dont2"),
    t("guidelines.dont3"),
    t("guidelines.dont4"),
    t("guidelines.dont5"),
  ];

  const situations: {
    icon: LucideIcon;
    title: string;
    sub: string;
    steps: string[];
    accent: string;
  }[] = [
    {
      icon: Package,
      title: t("guidelines.s1Title"),
      sub: t("guidelines.s1Sub"),
      steps: [t("guidelines.s1a"), t("guidelines.s1b"), t("guidelines.s1c")],
      accent: "border-slate-200 bg-white",
    },
    {
      icon: Home,
      title: t("guidelines.s2Title"),
      sub: t("guidelines.s2Sub"),
      steps: [t("guidelines.s2a"), t("guidelines.s2b"), t("guidelines.s2c")],
      accent: "border-blue-200 bg-blue-50/40",
    },
    {
      icon: Wind,
      title: t("guidelines.s3Title"),
      sub: t("guidelines.s3Sub"),
      steps: [t("guidelines.s3a"), t("guidelines.s3b"), t("guidelines.s3c")],
      accent: "border-amber-200 bg-amber-50/40",
    },
    {
      icon: Car,
      title: t("guidelines.s4Title"),
      sub: t("guidelines.s4Sub"),
      steps: [t("guidelines.s4a"), t("guidelines.s4b"), t("guidelines.s4c")],
      accent: "border-orange-200 bg-orange-50/30",
    },
  ];

  const kit = [
    t("guidelines.kit1"),
    t("guidelines.kit2"),
    t("guidelines.kit3"),
    t("guidelines.kit4"),
    t("guidelines.kit5"),
    t("guidelines.kit6"),
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

        <Reveal className="mb-6">
          <SourceStamp source={t("guidelines.stamp")} />
        </Reveal>

        {/* Do / Don't */}
        <Stagger className="mb-10 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-emerald-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
                <Check size={18} strokeWidth={3} />
              </span>
              <h3 className="text-lg font-black">{t("guidelines.doTitle")}</h3>
            </div>
            <ul className="space-y-3">
              {dos.map((item) => (
                <li key={item} className="flex gap-2.5 text-base leading-relaxed text-emerald-950">
                  <Check size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2 text-red-800">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
                <X size={18} strokeWidth={3} />
              </span>
              <h3 className="text-lg font-black">{t("guidelines.dontTitle")}</h3>
            </div>
            <ul className="space-y-3">
              {donts.map((item) => (
                <li key={item} className="flex gap-2.5 text-base leading-relaxed text-red-950">
                  <X size={18} className="mt-0.5 shrink-0 text-red-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </Stagger>

        {/* 상황별 */}
        <Reveal className="mb-4">
          <h3 className="text-xl font-black text-[#0B2B66]">{t("guidelines.situationsTitle")}</h3>
        </Reveal>
        <Stagger className="mb-10 grid gap-4 md:grid-cols-2">
          {situations.map((s) => {
            const Icon = s.icon;
            return (
              <article
                key={s.title}
                className={`rounded-2xl border p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-6 ${s.accent}`}
              >
                <div className="mb-3 flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0B2B66] text-white">
                    <Icon size={20} />
                  </span>
                  <div>
                    <h4 className="text-lg font-black text-[#0B2B66]">{s.title}</h4>
                    <p className="text-sm font-semibold text-slate-500">{s.sub}</p>
                  </div>
                </div>
                <ol className="space-y-2.5">
                  {s.steps.map((step, i) => (
                    <li key={step} className="flex gap-3 text-base leading-relaxed text-slate-800">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0B2B66]/10 text-sm font-black text-[#0B2B66]">
                        {i + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </article>
            );
          })}
        </Stagger>

        {/* 비상용품 */}
        <Reveal className="mb-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-lg font-black text-[#0B2B66]">{t("guidelines.kitTitle")}</h3>
          <ul className="grid gap-3 sm:grid-cols-2">
            {kit.map((item, i) => (
              <li
                key={item}
                className="flex items-start gap-2.5 rounded-xl border border-slate-100 bg-[#FAFBFC] px-3 py-3 text-base text-slate-800"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#0B2B66] text-xs font-black text-white">
                  {i + 1}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-4 sm:px-5">
          <AlertTriangle size={22} className="mt-0.5 shrink-0 text-amber-700" />
          <div>
            <p className="text-base font-black text-amber-900">{t("guidelines.noteTitle")}</p>
            <p className="mt-1 text-base leading-relaxed text-amber-950/90">{t("guidelines.noteBody")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
