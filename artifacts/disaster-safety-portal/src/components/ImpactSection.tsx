import SectionHeader from "@/components/SectionHeader";
import SourceStamp from "@/components/SourceStamp";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import { Plane } from "lucide-react";
import { useT } from "@/i18n/I18nContext";

export default function ImpactSection() {
  const t = useT();

  const IMPACTS = [
    { sector: t("impact.i1s"), type: t("impact.i1t"), body: t("impact.i1b") },
    { sector: t("impact.i2s"), type: t("impact.i2t"), body: t("impact.i2b") },
    { sector: t("impact.i3s"), type: t("impact.i3t"), body: t("impact.i3b") },
    { sector: t("impact.i4s"), type: t("impact.i4t"), body: t("impact.i4b") },
    { sector: t("impact.i5s"), type: t("impact.i5t"), body: t("impact.i5b") },
  ];

  return (
    <section id="impact" className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow={t("impact.eyebrow")}
          title={t("impact.title")}
          description={t("impact.description")}
          action={<SourceStamp source={t("impact.stamp")} />}
        />

        <Reveal
          as="article"
          className="mb-6 overflow-hidden rounded-2xl border-2 border-orange-300 bg-gradient-to-br from-orange-50 to-white shadow-sm"
        >
          <div className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:p-7">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white">
              <Plane size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-black uppercase tracking-wider text-orange-600">
                {t("impact.priority")}
              </p>
              <h3 className="mt-1 text-xl font-black text-[#0B2B66] md:text-2xl">
                {t("impact.mainSector")}
              </h3>
              <span className="mt-1 inline-block rounded-full bg-orange-100 px-2.5 py-0.5 text-sm font-bold text-orange-800">
                {t("impact.mainType")}
              </span>
              <p className="mt-3 text-base leading-relaxed text-slate-700">{t("impact.mainBody")}</p>
              <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                {[t("impact.p1"), t("impact.p2"), t("impact.p3")].map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="font-bold text-orange-500">·</span>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Stagger className="mb-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-4">
            <p className="text-sm font-bold text-slate-400">{t("impact.directLabel")}</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{t("impact.directBody")}</p>
          </div>
          <div className="rounded-2xl border border-[#0B2B66]/20 bg-[#0B2B66]/5 p-4">
            <p className="text-sm font-bold text-[#0B2B66]">{t("impact.indirectLabel")}</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{t("impact.indirectBody")}</p>
          </div>
        </Stagger>

        <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {IMPACTS.map((item) => (
            <article
              key={item.sector}
              className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-black text-[#0B2B66]">{item.sector}</h3>
                <span className="rounded-full border border-slate-100 bg-white px-2 py-0.5 text-sm font-bold text-slate-500">
                  {item.type}
                </span>
              </div>
              <p className="mt-2 text-base leading-relaxed text-slate-700">{item.body}</p>
            </article>
          ))}
        </Stagger>

        <Stagger className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-5">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
              {t("impact.read2010Label")}
            </p>
            <h3 className="mt-1 text-lg font-black text-[#0B2B66]">{t("impact.read2010Title")}</h3>
            <p className="mt-2 text-base leading-relaxed text-slate-700">{t("impact.read2010Body")}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-5">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
              {t("impact.read946Label")}
            </p>
            <h3 className="mt-1 text-lg font-black text-[#0B2B66]">{t("impact.read946Title")}</h3>
            <p className="mt-2 text-base leading-relaxed text-slate-700">{t("impact.read946Body")}</p>
          </div>
        </Stagger>
      </div>
    </section>
  );
}
