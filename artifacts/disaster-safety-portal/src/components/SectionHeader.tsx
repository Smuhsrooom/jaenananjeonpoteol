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
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
          {eyebrow}
        </p>
        <h2 className="text-2xl font-black tracking-tight text-[#0B2B66] md:text-3xl">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}
