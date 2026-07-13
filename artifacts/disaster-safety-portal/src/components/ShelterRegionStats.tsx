import { useEffect, useMemo, useState } from "react";
import { BarChart3, RefreshCw } from "lucide-react";
import SourceStamp from "@/components/SourceStamp";
import { useT } from "@/i18n/I18nContext";

type ShelterRegionRow = {
  year: number | null;
  region: string;
  targetPopulation: number | null;
  acceptanceRate: number | null;
  shelterablePopulation: number | null;
  govShelterablePopulation: number | null;
  pubShelterablePopulation: number | null;
  govSheltersCount: number | null;
  govSheltersArea: number | null;
  pubSheltersCount: number | null;
  pubSheltersArea: number | null;
};

type ShelterRegionResponse = {
  ok: boolean;
  data: ShelterRegionRow[];
  summary: {
    year: number | null;
    totalTargetPopulation: number;
    totalShelterablePopulation: number;
    totalGovSheltersCount: number;
    totalPubSheltersCount: number;
    totalGovSheltersArea: number;
    totalPubSheltersArea: number;
    averageAcceptanceRate: number | null;
  };
  fetchedAt: string;
  source: string;
  error?: string;
};

function formatNumber(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat("ko-KR").format(value);
}

function formatRate(value: number | null | undefined) {
  if (value == null || Number.isNaN(value)) return "—";
  return `${value.toFixed(1)}%`;
}

export default function ShelterRegionStats() {
  const t = useT();
  const [data, setData] = useState<ShelterRegionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/shelter/region?type=json&bas_yy=2019&pageNo=1&numOfRows=100", {
          signal: controller.signal,
        });
        const json = (await res.json()) as ShelterRegionResponse;
        if (!res.ok || !json.ok) {
          throw new Error(json.error || `HTTP ${res.status}`);
        }
        setData(json);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  const rows = useMemo(() => data?.data ?? [], [data]);
  const topRows = rows.slice(0, 6);
  const summary = data?.summary;

  return (
    <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mb-1 text-sm font-bold uppercase tracking-[0.2em] text-slate-400">
            {t("contacts.shelterApiEyebrow")}
          </p>
          <h3 className="text-lg font-black text-[#0B2B66]">{t("contacts.shelterApiTitle")}</h3>
          <p className="mt-1 text-sm text-slate-600">{t("contacts.shelterApiDescription")}</p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm text-slate-400">
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
          {loading ? t("contacts.shelterApiLoading") : t("contacts.shelterApiLegend")}
        </span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {t("contacts.shelterApiError")}: {error}
        </div>
      )}

      {summary && (
        <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label={t("contacts.shelterApiStat1")} value={formatNumber(summary.totalTargetPopulation)} />
          <StatCard label={t("contacts.shelterApiStat2")} value={formatNumber(summary.totalShelterablePopulation)} />
          <StatCard
            label={t("contacts.shelterApiStat3")}
            value={formatNumber(summary.totalGovSheltersCount + summary.totalPubSheltersCount)}
          />
          <StatCard label={t("contacts.shelterApiStat4")} value={formatRate(summary.averageAcceptanceRate)} />
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-[#FAFBFC] px-4 py-2 text-sm font-semibold text-slate-500">
          <BarChart3 size={14} />
          {t("contacts.shelterApiTableTitle")}
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-white">
              <tr className="border-b border-slate-100 text-slate-500">
                <th className="px-4 py-3 font-semibold">{t("contacts.shelterApiColRegion")}</th>
                <th className="px-4 py-3 font-semibold">{t("contacts.shelterApiColTarget")}</th>
                <th className="px-4 py-3 font-semibold">{t("contacts.shelterApiColAccept")}</th>
                <th className="px-4 py-3 font-semibold">{t("contacts.shelterApiColShelters")}</th>
                <th className="px-4 py-3 font-semibold">{t("contacts.shelterApiColYear")}</th>
              </tr>
            </thead>
            <tbody>
              {!loading && topRows.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-slate-500">
                    {t("contacts.shelterApiEmpty")}
                  </td>
                </tr>
              )}
              {topRows.map((row) => (
                <tr key={row.region} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-3 font-semibold text-[#0B2B66]">{row.region}</td>
                  <td className="px-4 py-3 text-slate-700">{formatNumber(row.targetPopulation)}</td>
                  <td className="px-4 py-3 text-slate-700">{formatRate(row.acceptanceRate)}</td>
                  <td className="px-4 py-3 text-slate-700">
                    {formatNumber((row.govSheltersCount ?? 0) + (row.pubSheltersCount ?? 0))}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{row.year ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-3 text-sm text-slate-500">{t("contacts.shelterApiNote")}</p>
      {data?.fetchedAt && <SourceStamp source={t("contacts.shelterApiSource")} updatedAt={data.fetchedAt} />}
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-[#FAFBFC] px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-[#0B2B66]">{value}</p>
    </div>
  );
}
