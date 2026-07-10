import Reveal from "@/components/motion/Reveal";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-3xl">
        <p className="mb-2 text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-black tracking-tight text-[#0B2B66] md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 text-base leading-relaxed text-slate-700 md:text-lg">
            {description}
          </p>
        )}
      </div>
      {action}
    </Reveal>
  );
}
