import HeroSection from "@/components/HeroSection";
import LiveMap from "@/components/LiveMap";
import { Link } from "wouter";
import { ROUTES } from "@/lib/routes";
import { ChevronRight } from "lucide-react";

export default function HomePage() {
  const others = ROUTES.filter((r) => r.path !== "/");

  return (
    <>
      <HeroSection />
      <LiveMap />
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            사이트 메뉴
          </p>
          <h2 className="text-lg font-black text-[#0B2B66]">필요한 정보로 바로 이동</h2>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((r) => (
              <Link
                key={r.path}
                href={r.path}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-[#FAFBFC] px-4 py-3 transition hover:border-[#0B2B66]/30 hover:bg-white"
              >
                <span className="text-sm font-semibold text-slate-800">
                  {"live" in r && r.live && (
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                  {r.label}
                </span>
                <ChevronRight
                  size={16}
                  className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0B2B66]"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
