import SectionHeader from "@/components/SectionHeader";
import { ALERT_LEVELS } from "@/lib/alertLevels";
import { useAlertLevel } from "@/context/AlertLevelContext";

export default function AlertLevelsSection() {
  const { levelId, setLevelId, suggestedId, followSuggested, manual, level } =
    useAlertLevel();

  return (
    <section id="alert-levels" className="border-b border-slate-200 bg-white py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow="03 · Alert levels"
          title="위기경보 4단계"
          description="관심 → 주의 → 경계 → 심각. 카드를 누르면 상단 배너 색·문구가 바뀝니다. 단계마다 국민에게 요구되는 행동 수준이 다릅니다."
          action={
            manual ? (
              <button
                type="button"
                onClick={followSuggested}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#0B2B66] hover:bg-slate-50"
              >
                관측 제안 단계로 돌아가기
              </button>
            ) : (
              <span className="text-[11px] text-slate-500">
                현재 배너 = 관측 제안 (
                {ALERT_LEVELS.find((l) => l.id === suggestedId)?.nameKo})
              </span>
            )
          }
        />

        {/* 현재 배너 문구 미리보기 */}
        <div
          className={`mb-6 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-sm ${level.bgClass} ${
            level.id === "caution" ? "!text-slate-900" : ""
          }`}
        >
          {level.bannerLine}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ALERT_LEVELS.map((lv) => {
            const active = levelId === lv.id;
            return (
              <button
                key={lv.id}
                type="button"
                onClick={() => setLevelId(lv.id)}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  active
                    ? `${lv.borderClass} bg-white shadow-md ring-2 ring-offset-2`
                    : "border-slate-200 bg-[#FAFBFC] hover:border-slate-300"
                }`}
              >
                <div
                  className="mb-3 h-2 w-full rounded-full"
                  style={{ backgroundColor: lv.color }}
                />
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {lv.nameEn}
                </p>
                <h3 className="text-xl font-black text-[#0B2B66]">{lv.nameKo}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{lv.description}</p>
                <p className="mt-3 rounded-lg border border-slate-100 bg-white/80 px-2.5 py-2 text-[11px] font-medium leading-snug text-slate-800">
                  국민 행동: {lv.citizenAction}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-10">
          <h3 className="text-sm font-black text-[#0B2B66]">상황 보고서 → 경보 단계</h3>
          <p className="mt-1 text-xs text-slate-500">
            상황을 선택하면 해당 경보 단계로 배너가 바뀝니다.
          </p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-bold">상황 보고서</th>
                  <th className="px-4 py-3 font-bold w-24">단계</th>
                  <th className="hidden px-4 py-3 font-bold sm:table-cell">판단 근거</th>
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
                    <td className="px-4 py-3 text-xs leading-relaxed text-slate-700">
                      {lv.situationReport}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 text-[11px] font-black text-white"
                        style={{ backgroundColor: lv.color }}
                      >
                        {lv.nameKo}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-slate-500 sm:table-cell">
                      {lv.example}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
