import SectionHeader from "@/components/SectionHeader";
import SourceStamp from "@/components/SourceStamp";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import { useT } from "@/i18n/I18nContext";

export default function DefinitionSection() {
  const t = useT();

  return (
    <section id="definition" className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow={t("definition.eyebrow")}
          title={t("definition.title")}
          description={t("definition.description")}
          action={<SourceStamp source={t("definition.stamp")} />}
        />

        <Reveal className="rounded-2xl border border-slate-200 bg-[#0B2B66] p-6 text-white shadow-lg md:p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-200/80">
            {t("definition.legalLabel")}
          </p>
          <p className="mt-3 text-base leading-relaxed text-blue-50 md:text-lg">
            {t("definition.legalBodyBefore")}{" "}
            <strong className="text-white">{t("definition.legalStrong")}</strong>
            {t("definition.legalBodyAfter")}
          </p>
        </Reveal>

        <Stagger className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-5">
            <h3 className="text-xl font-black text-[#0B2B66]">{t("definition.naturalTitle")}</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
              {t("definition.naturalBody")}
            </p>
            <p className="mt-4 rounded-lg border border-slate-100 bg-white px-3 py-2.5 text-base text-slate-600">
              {t("definition.naturalNote")}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-5 sm:p-6">
            <h3 className="text-xl font-black text-[#0B2B66]">{t("definition.socialTitle")}</h3>
            <p className="mt-3 text-base leading-relaxed text-slate-700 sm:text-lg">
              {t("definition.socialBody")}
            </p>
            <p className="mt-4 rounded-lg border border-slate-100 bg-white px-3 py-2.5 text-base text-slate-600">
              {t("definition.socialNote")}
            </p>
          </div>
        </Stagger>
      </div>
    </section>
  );
}
