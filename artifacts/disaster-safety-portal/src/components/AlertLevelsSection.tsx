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
    <section
      id="alert-levels"
      className="border-b border-slate-200 py-14 transition-colors duration-300"
      style={{ backgroundColor: level.softColor }}
    >
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
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50"
                style={{ color: level.inkColor }}
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
          className="mb-6 rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm transition-colors duration-300"
          style={{
            backgroundColor: level.color,
            color: level.id === "caution" ? "#1a1a1a" : "#fff",
          }}
        >
          {bannerLine}
        </Reveal>

        <p className="mb-3 text-sm font-bold text-slate-600">{t("alertsPage.pickHint")}</p>
        <Stagger className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ALERT_LEVELS.map((lv) => {
            const active = levelId === lv.id;
            return (
              <button
                key={lv.id}
                type="button"
                onClick={() => setLevelId(lv.id)}
                className={`rounded-2xl border-2 p-4 text-left transition duration-200 hover:-translate-y-0.5 ${
                  active ? "bg-white shadow-md ring-2 ring-offset-2" : "bg-white/90 hover:shadow-sm"
                }`}
                style={{
                  borderColor: active ? lv.color : "#e2e8f0",
                  outlineColor: active ? lv.color : undefined,
                }}
              >
                <div
                  className="mb-3 h-2.5 w-full rounded-full"
                  style={{ backgroundColor: lv.color }}
                />
                <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                  {t(alertTextKey(lv.id, "nameEn"))}
                </p>
                <h3 className="text-xl font-black" style={{ color: lv.inkColor }}>
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
                {lv.id === "serious" && (
                  <p className="mt-2 text-xs font-bold text-red-700">{t("alertsPage.seriousHint")}</p>
                )}
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
