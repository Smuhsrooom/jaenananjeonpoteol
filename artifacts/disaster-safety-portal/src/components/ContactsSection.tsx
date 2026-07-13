import { MapPin, Phone } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import Stagger from "@/components/motion/Stagger";
import ShelterRegionStats from "@/components/ShelterRegionStats";
import ShelterMap from "@/components/ShelterMap";
import { useT } from "@/i18n/I18nContext";

export default function ContactsSection() {
  const t = useT();

  const CONTACTS = [
    { name: t("contacts.c1n"), number: "119", desc: t("contacts.c1d") },
    { name: t("contacts.c2n"), number: "112", desc: t("contacts.c2d") },
    { name: t("contacts.c3n"), number: "131", desc: t("contacts.c3d") },
    { name: t("contacts.c4n"), number: "02-2100-3399", desc: t("contacts.c4d") },
    { name: t("contacts.c5n"), number: "02-2181-0900", desc: t("contacts.c5d") },
  ];

  const SHELTERS = [
    { name: t("contacts.s1n"), desc: t("contacts.s1d"), note: t("contacts.s1k") },
    { name: t("contacts.s2n"), desc: t("contacts.s2d"), note: t("contacts.s2k") },
    { name: t("contacts.s3n"), desc: t("contacts.s3d"), note: t("contacts.s3k") },
    { name: t("contacts.s4n"), desc: t("contacts.s4d"), note: t("contacts.s4k") },
  ];

  return (
    <section id="contacts" className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow={t("contacts.eyebrow")}
          title={t("contacts.title")}
          description={t("contacts.description")}
        />
        <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CONTACTS.map((c) => (
            <a
              key={c.number}
              href={`tel:${c.number}`}
              className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#0B2B66]/30 hover:shadow-sm"
            >
              <div className="mb-2 flex items-center gap-1.5 text-slate-400">
                <Phone size={12} />
                <span className="text-sm font-bold uppercase tracking-wide">{c.name}</span>
              </div>
              <p className="text-2xl font-black text-[#0B2B66]">{c.number}</p>
              <p className="mt-1 text-sm text-slate-500">{c.desc}</p>
            </a>
          ))}
        </Stagger>

        <div className="mt-10">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
                {t("contacts.shelterEyebrow")}
              </p>
              <h3 className="text-lg font-black text-[#0B2B66]">{t("contacts.shelterTitle")}</h3>
              <p className="mt-1 text-sm text-slate-600">{t("contacts.shelterDescription")}</p>
            </div>
            <a
              href="https://www.safekorea.go.kr/"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-semibold text-[#0B2B66] underline-offset-2 hover:underline"
            >
              {t("contacts.shelterCta")}
            </a>
          </div>

          <Stagger className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {SHELTERS.map((s) => (
              <article
                key={s.name}
                className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-4 transition duration-200 hover:-translate-y-0.5 hover:border-[#0B2B66]/30 hover:shadow-sm"
              >
                <div className="mb-2 flex items-center gap-1.5 text-slate-400">
                  <MapPin size={12} />
                  <span className="text-sm font-bold uppercase tracking-wide">{s.name}</span>
                </div>
                <p className="text-base font-semibold text-[#0B2B66]">{s.desc}</p>
                <p className="mt-1 text-sm text-slate-500">{s.note}</p>
              </article>
            ))}
          </Stagger>

          <p className="mt-3 text-sm text-slate-500">{t("contacts.shelterNote")}</p>
        </div>

        <ShelterRegionStats />
        <ShelterMap />
      </div>
    </section>
  );
}
