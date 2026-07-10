import type { CSSProperties, ComponentType } from "react";
import {
  ArrowRight,
  Activity,
  Mountain,
  Waves,
  ListChecks,
  ShieldCheck,
  MessageCircleWarning,
} from "lucide-react";
import { Link } from "wouter";
import { useAlertLevel } from "@/context/AlertLevelContext";
import { useEarthquake, useLatestEarthquake } from "@/context/EarthquakeContext";
import { useLatestVolcano, useVolcano } from "@/context/VolcanoContext";
import SourceStamp from "@/components/SourceStamp";
import { formatKst } from "@/lib/format";
import { alertTextKey } from "@/lib/alertLevels";
import { useI18n } from "@/i18n/I18nContext";

export default function HeroSection() {
  const { level } = useAlertLevel();
  const { data: eqData, lastRefresh: eqRefresh, source: eqSource } = useEarthquake();
  const { data: volData, lastRefresh: volRefresh } = useVolcano();
  const latestEq = useLatestEarthquake();
  const latestVol = useLatestVolcano();
  const { t, localeTag } = useI18n();

  const levelName = t(alertTextKey(level.id, "name"));
  const levelNameEn = t(alertTextKey(level.id, "nameEn"));
  const citizenAction = t(alertTextKey(level.id, "citizenAction"));

  return (
    <section className="hero-enter border-b border-slate-200 bg-[#FAFBFC]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div
          className="hero-enter__item mb-3 flex flex-wrap items-center gap-2"
          style={{ ["--i" as string]: 0 }}
        >
          <span className="rounded-full bg-[#0B2B66] px-3 py-1 text-sm font-bold uppercase tracking-wider text-white">
            {t("hero.badge")}
          </span>
          <SourceStamp source={t("hero.stamp")} />
        </div>

        <h1
          className="hero-enter__item max-w-4xl text-4xl font-black leading-[1.15] tracking-tight text-[#0B2B66] sm:text-5xl lg:text-6xl"
          style={{ ["--i" as string]: 1 }}
        >
          {t("hero.title")}
          <span className="mt-3 block text-xl font-semibold text-slate-700 sm:text-2xl">
            {t("hero.subtitle")}
          </span>
        </h1>
        <p
          className="hero-enter__item mt-5 max-w-3xl text-lg leading-relaxed text-slate-700 sm:text-xl"
          style={{ ["--i" as string]: 2 }}
        >
          {t("hero.leadBefore")}{" "}
          <strong className="text-slate-800">{t("hero.leadStrong")}</strong>
          {t("hero.leadAfter")}
        </p>

        <div
          className="hero-enter__item mt-8 grid gap-3 md:grid-cols-2"
          style={{ ["--i" as string]: 3 }}
        >
          <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-red-700">
              <MessageCircleWarning size={16} />
              <p className="text-base font-black">{t("hero.fakeTitle")}</p>
            </div>
            <ul className="space-y-2 text-base leading-relaxed text-red-950">
              <li>{t("hero.fake1")}</li>
              <li>{t("hero.fake2")}</li>
              <li>{t("hero.fake3")}</li>
            </ul>
            <p className="mt-3 text-sm font-semibold text-red-900 sm:text-base">{t("hero.fakeNote")}</p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 transition duration-200 hover:-translate-y-0.5 hover:shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-emerald-800">
              <ShieldCheck size={20} />
              <p className="text-base font-black">{t("hero.officialTitle")}</p>
            </div>
            <ul className="space-y-2 text-base leading-relaxed text-emerald-950">
              <li>{t("hero.official1")}</li>
              <li>{t("hero.official2")}</li>
              <li>{t("hero.official3")}</li>
            </ul>
            <p className="mt-3 text-sm font-semibold text-emerald-950 sm:text-base">
              {t("hero.officialNote")}
            </p>
          </div>
        </div>

        <div className="hero-enter__item mt-8" style={{ ["--i" as string]: 4 }}>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
            {t("hero.threeTitle")}
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <CheckCard
              n="01"
              title={t("hero.check1Title")}
              href="/alerts"
              cta={t("hero.check1Cta")}
              body={
                <>
                  <span className={`font-black ${level.textClass}`}>{levelName}</span>
                  <span className="text-slate-600"> — {citizenAction}</span>
                </>
              }
            />
            <CheckCard
              n="02"
              title={t("hero.check2Title")}
              href="/live"
              cta={t("hero.check2Cta")}
              body={
                latestVol || latestEq ? (
                  <>
                    {latestVol && (
                      <span>
                        {t("hero.volLabel")} {latestVol.volcanoName ?? "—"}
                        {latestVol.plumeHeightKm != null
                          ? ` · ${latestVol.plumeHeightKm}km`
                          : ""}
                      </span>
                    )}
                    {latestVol && latestEq && " / "}
                    {latestEq && (
                      <span>
                        {t("hero.eqLabel")} M{latestEq.magnitude.toFixed(1)} · {latestEq.location}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-slate-500">{t("hero.check2Loading")}</span>
                )
              }
            />
            <CheckCard
              n="03"
              title={t("hero.check3Title")}
              href="/guidelines"
              cta={t("hero.check3Cta")}
              body={<span>{citizenAction}</span>}
            />
          </div>
        </div>

        <div
          className="hero-enter__item mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"
          style={{ ["--i" as string]: 5 }}
        >
          <MiniStat
            icon={ListChecks}
            label={t("hero.statAlert")}
            value={levelName}
            sub={levelNameEn}
            accent={level.color}
          />
          <MiniStat
            icon={Mountain}
            label={t("hero.statVol")}
            value={t("common.count", { n: volData.length })}
            sub={latestVol ? formatKst(latestVol.announcedAt, undefined, localeTag) : "—"}
          />
          <MiniStat
            icon={Waves}
            label={t("hero.statEq")}
            value={t("common.count", { n: eqData.length })}
            sub={
              eqData.length
                ? t("hero.maxM", {
                    n: Math.max(...eqData.map((e) => e.magnitude)).toFixed(1),
                  })
                : "—"
            }
          />
          <MiniStat
            icon={Activity}
            label={t("hero.statSource")}
            value={t("hero.statKma")}
            sub={eqSource === "kma-apihub" ? "API Hub" : eqSource ?? "—"}
          />
        </div>

        <div
          className="hero-enter__item mt-4 flex flex-wrap gap-2"
          style={{ ["--i" as string]: 6 }}
        >
          <SourceStamp source={t("hero.stampVol")} updatedAt={volRefresh} />
          <SourceStamp source={t("hero.stampEq")} updatedAt={eqRefresh} />
        </div>
        <p
          className="hero-enter__item mt-3 text-sm text-slate-400"
          style={{ ["--i" as string]: 7 }}
        >
          {t("hero.disclaimer")}
        </p>
      </div>
    </section>
  );
}

function CheckCard({
  n,
  title,
  body,
  href,
  cta,
}: {
  n: string;
  title: string;
  body: React.ReactNode;
  href: string;
  cta: string;
}) {
  return (
    <Link
      href={href}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="group block rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#0B2B66]/30 hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-black text-slate-300">{n}</span>
        <ArrowRight
          size={14}
          className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0B2B66]"
        />
      </div>
      <p className="text-base font-bold text-[#0B2B66] sm:text-lg">{title}</p>
      <p className="mt-2 line-clamp-4 text-base leading-relaxed text-slate-700 sm:text-base">{body}</p>
      <p className="mt-3 text-sm font-bold text-[#0B2B66] sm:text-base group-hover:underline">
        {cta} →
      </p>
    </Link>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: ComponentType<{ size?: number; className?: string; style?: CSSProperties }>;
  label: string;
  value: string;
  sub: string;
  accent?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-sm">
      <div className="mb-1.5 flex items-center gap-1.5 text-slate-500">
        <Icon size={16} style={accent ? { color: accent } : undefined} />
        <span className="text-sm font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p
        className="truncate text-2xl font-black text-[#0B2B66]"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      <p className="mt-1 truncate text-sm text-slate-600">{sub}</p>
    </div>
  );
}
