import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";
import { ALERT_LEVELS, alertTextKey } from "@/lib/alertLevels";
import { useAlertLevel } from "@/context/AlertLevelContext";
import { useT } from "@/i18n/I18nContext";

export default function AlertLevelsSection() {
  const { levelId, setLevelId, suggestedId, followSuggested, manual, level } =
    useAlertLevel();
  const t = useT();

  const suggestedName = t(alertTextKey(suggestedId, "name"));
  const bannerLine = t(alertTextKey(level.id, "bannerLine"));

  return (
    <section id="alert-levels" className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow={t("alertsPage.eyebrow")}
          title={t("alertsPage.title")}
          description={t("alertsPage.description")}
          action={
            manual ? (
              <button
                type="button"
                onClick={followSuggested}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-[#0B2B66] hover:bg-slate-50"
              >
                {t("alertsPage.backSuggested")}
              </button>
            ) : (
              <span className="text-sm text-slate-500">
                {t("alertsPage.currentBanner", { name: suggestedName })}
              </span>
            )
          }
        />

        <Reveal
          className={`mb-6 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm ${level.bgClass} ${
            level.id === "caution" ? "!text-slate-900" : ""
          }`}
        >
          {bannerLine}
        </Reveal>

        <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ALERT_LEVELS.map((lv) => {
            const active = levelId === lv.id;
            return (
              <button
                key={lv.id}
                type="button"
                onClick={() => setLevelId(lv.id)}
                className={`rounded-2xl border-2 p-4 text-left transition duration-200 hover:-translate-y-0.5 ${
                  active
                    ? `${lv.borderClass} bg-white shadow-md ring-2 ring-offset-2`
                    : "border-slate-200 bg-[#FAFBFC] hover:border-slate-300"
                }`}
              >
                <div
                  className="mb-3 h-2 w-full rounded-full"
                  style={{ backgroundColor: lv.color }}
                />
                <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  {t(alertTextKey(lv.id, "nameEn"))}
                </p>
                <h3 className="text-xl font-black text-[#0B2B66]">
                  {t(alertTextKey(lv.id, "name"))}
                </h3>
                <p className="mt-2 text-base leading-relaxed text-slate-700">
                  {t(alertTextKey(lv.id, "description"))}
                </p>
                <p className="mt-3 rounded-lg border border-slate-100 bg-white/80 px-2.5 py-2 text-sm font-medium leading-snug text-slate-800">
                  {t("alertsPage.citizen", {
                    action: t(alertTextKey(lv.id, "citizenAction")),
                  })}
                </p>
              </button>
            );
          })}
        </Stagger>

        <Reveal className="mt-10">
          <h3 className="text-lg font-black text-[#0B2B66]">{t("alertsPage.tableTitle")}</h3>
          <p className="mt-1 text-sm text-slate-500">{t("alertsPage.tableDesc")}</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-sm uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-bold">{t("alertsPage.colReport")}</th>
                  <th className="w-24 px-4 py-3 font-bold">{t("alertsPage.colLevel")}</th>
                  <th className="hidden px-4 py-3 font-bold sm:table-cell">
                    {t("alertsPage.colBasis")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ALERT_LEVELS.map((lv) => (
                  <tr
                    key={lv.id}
                    className={`cursor-pointer transition hover:bg-slate-50 ${
                      levelId === lv.id ? "bg-[#0B2B66]/5" : "bg-white"
                    }`}
                    onClick={() => setLevelId(lv.id)}
                  >
                    <td className="px-4 py-3 text-base leading-relaxed text-slate-700">
                      {t(alertTextKey(lv.id, "situationReport"))}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-sm font-black text-white"
                        style={{ backgroundColor: lv.color }}
                      >
                        {t(alertTextKey(lv.id, "name"))}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-sm text-slate-500 sm:table-cell">
                      {t(alertTextKey(lv.id, "example"))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
