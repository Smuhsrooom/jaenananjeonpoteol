import { Phone } from "lucide-react";
import SectionHeader from "@/components/SectionHeader";

const CONTACTS = [
  { name: "긴급신고 통합", number: "119", desc: "화재·구조·구급" },
  { name: "경찰 신고", number: "112", desc: "범죄·긴급사태" },
  { name: "기상콜센터", number: "131", desc: "기상·지진·화산 안내" },
  { name: "행정안전부", number: "02-2100-3399", desc: "재난 안전 정책" },
  { name: "기상청", number: "02-2181-0900", desc: "지진·화산 관측" },
];

export default function ContactsSection() {
  return (
    <section id="contacts" className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="07 · Contacts"
          title="비상 연락처"
          description="고정 공식 번호입니다. API가 아닌 상시 안내 정보입니다."
        />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {CONTACTS.map((c) => (
            <a
              key={c.number}
              href={`tel:${c.number}`}
              className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-4 transition hover:border-[#0B2B66]/30"
            >
              <div className="mb-2 flex items-center gap-1.5 text-slate-400">
                <Phone size={12} />
                <span className="text-[10px] font-bold uppercase tracking-wide">{c.name}</span>
              </div>
              <p className="text-2xl font-black text-[#0B2B66]">{c.number}</p>
              <p className="mt-1 text-[11px] text-slate-500">{c.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
