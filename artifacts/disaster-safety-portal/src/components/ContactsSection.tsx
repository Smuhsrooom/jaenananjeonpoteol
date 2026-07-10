import { Phone } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import Stagger from "@/components/motion/Stagger";
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
      </div>
    </section>
  );
}
