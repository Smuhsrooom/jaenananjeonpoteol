import SectionHeader from "@/components/SectionHeader";
import Stagger from "@/components/motion/Stagger";
import Reveal from "@/components/motion/Reveal";
import { useT } from "@/i18n/I18nContext";

export default function SystemSection() {
  const t = useT();

  const ACTORS = [
    { role: t("system.actor1Role"), name: t("system.actor1Name"), desc: t("system.actor1Desc") },
    { role: t("system.actor2Role"), name: t("system.actor2Name"), desc: t("system.actor2Desc") },
    { role: t("system.actor3Role"), name: t("system.actor3Name"), desc: t("system.actor3Desc") },
  ];

  const STAGES = [
    { step: t("system.stage1"), ex: t("system.stage1Ex") },
    { step: t("system.stage2"), ex: t("system.stage2Ex") },
    { step: t("system.stage3"), ex: t("system.stage3Ex") },
    { step: t("system.stage4"), ex: t("system.stage4Ex") },
  ];

  return (
    <section id="system" className="border-b border-slate-200 bg-[#FAFBFC] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow={t("system.eyebrow")}
          title={t("system.title")}
          description={t("system.description")}
        />

        <Stagger className="grid gap-4 md:grid-cols-3">
          {ACTORS.map((a, i) => (
            <div
              key={a.name}
              className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="text-sm font-black text-slate-300">0{i + 1}</span>
              <p className="mt-1 text-sm font-bold uppercase tracking-wider text-orange-600">
                {a.role}
              </p>
              <h3 className="mt-1 text-lg font-black text-[#0B2B66]">{a.name}</h3>
              <p className="mt-2 text-base leading-relaxed text-slate-700">{a.desc}</p>
            </div>
          ))}
        </Stagger>

        <Reveal className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 md:p-6">
          <h3 className="text-lg font-black text-[#0B2B66]">{t("system.stagesTitle")}</h3>
          <p className="mt-1 text-sm text-slate-500">{t("system.stagesDesc")}</p>
          <Stagger className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-4" step={45}>
            {STAGES.map((s, i) => (
              <div
                key={s.step}
                className="rounded-xl border border-slate-100 bg-[#FAFBFC] px-3 py-3 text-center transition duration-200 hover:-translate-y-0.5"
              >
                <p className="text-sm font-bold text-slate-400">{i + 1}</p>
                <p className="text-lg font-black text-[#0B2B66]">{s.step}</p>
                <p className="mt-1 text-sm text-slate-500">{s.ex}</p>
              </div>
            ))}
          </Stagger>
        </Reveal>
      </div>
    </section>
  );
}
