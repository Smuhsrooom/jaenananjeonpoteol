import SectionHeader from "@/components/SectionHeader";
import SourceStamp from "@/components/SourceStamp";

export default function DefinitionSection() {
  return (
    <section id="definition" className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="01 · Legal basis"
          title="재난이란 무엇인가"
          description="웹페이지가 서 있는 법적 근거입니다. 화산활동은 이미 법률에 명시된 자연재난입니다."
          action={<SourceStamp source="재난 및 안전관리 기본법" />}
        />

        <div className="rounded-2xl border border-slate-200 bg-[#0B2B66] p-6 text-white shadow-lg md:p-8">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-200/80">
            법적 정의
          </p>
          <p className="mt-3 text-sm leading-relaxed text-blue-50 md:text-[15px]">
            「재난 및 안전관리 기본법」은 재난을{" "}
            <strong className="text-white">
              국민의 생명·신체·재산과 국가에 피해를 주거나 줄 수 있는 것
            </strong>
            으로 정의하고, 크게 두 가지로 나눕니다.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-5">
            <h3 className="text-sm font-black text-[#0B2B66]">자연재난</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              태풍, 홍수, 지진, <strong>화산활동</strong>, 폭설 등 자연현상으로 발생하는 재난
            </p>
            <p className="mt-3 rounded-lg bg-white px-3 py-2 text-[11px] text-slate-500 border border-slate-100">
              핵심: 백두산 분화 = 국가가 법에 따라 관리해야 하는 공식 재난
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-[#FAFBFC] p-5">
            <h3 className="text-sm font-black text-[#0B2B66]">사회재난</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              화재, 붕괴, 감염병, 대규모 사고 등 인간의 활동과 관련하여 발생하는 재난
            </p>
            <p className="mt-3 rounded-lg bg-white px-3 py-2 text-[11px] text-slate-500 border border-slate-100">
              판단 기준: 무엇이 원인인가 — 자연현상인가, 인간 활동인가
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
