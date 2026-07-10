import HeroSection from "@/components/HeroSection";
import LiveMap from "@/components/LiveMap";
import TodayTmi from "@/components/TodayTmi";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import { Link } from "wouter";
import { ROUTES } from "@/lib/routes";
import { ChevronRight } from "lucide-react";
import { useT } from "@/i18n/I18nContext";

export default function HomePage() {
  const t = useT();
  const others = ROUTES.filter((r) => r.path !== "/");

  return (
    <>
      <HeroSection />
      <Reveal>
        <LiveMap />
      </Reveal>
      <section className="border-b border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Reveal>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
              {t("common.siteMenu")}
            </p>
            <h2 className="text-lg font-black text-[#0B2B66]">{t("common.homeMenuTitle")}</h2>
          </Reveal>
          <Stagger className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((r) => (
              <Link
                key={r.path}
                href={r.path}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="group flex items-center justify-between rounded-xl border border-slate-200 bg-[#FAFBFC] px-4 py-3 transition duration-200 hover:-translate-y-0.5 hover:border-[#0B2B66]/30 hover:bg-white hover:shadow-sm"
              >
                <span className="text-sm font-semibold text-slate-800">
                  {"live" in r && r.live && (
                    <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                  {t(r.labelKey)}
                </span>
                <ChevronRight
                  size={16}
                  className="text-slate-300 transition duration-200 group-hover:translate-x-0.5 group-hover:text-[#0B2B66]"
                />
              </Link>
            ))}
          </Stagger>
        </div>
      </section>
      <TodayTmi />
    </>
  );
}
