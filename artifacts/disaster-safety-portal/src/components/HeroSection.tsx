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

export default function HeroSection() {
  const { level } = useAlertLevel();
  const { data: eqData, lastRefresh: eqRefresh, source: eqSource } = useEarthquake();
  const { data: volData, lastRefresh: volRefresh } = useVolcano();
  const latestEq = useLatestEarthquake();
  const latestVol = useLatestVolcano();

  return (
    <section className="border-b border-slate-200 bg-[#FAFBFC]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#0B2B66] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
            국가 재난안전센터
          </span>
          <SourceStamp source="공식 안내 + 기상청 관측" />
        </div>

        <h1 className="max-w-3xl text-3xl font-black leading-tight tracking-tight text-[#0B2B66] sm:text-4xl lg:text-[2.75rem]">
          믿을 정보와 지금 행동.
          <span className="mt-2 block text-lg font-semibold text-slate-600 sm:text-xl">
            백두산 화산재 대비 — 국가 재난관리와 시민의 대응
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-[15px]">
          SNS 소문이 퍼질 때,{" "}
          <strong className="text-slate-800">무엇이 진짜인지·지금 무엇을 해야 하는지</strong>를
          공식 근거로 안내합니다.
        </p>

        {/* 가짜 vs 공식 */}
        <div className="mt-8 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4">
            <div className="mb-2 flex items-center gap-2 text-red-700">
              <MessageCircleWarning size={16} />
              <p className="text-xs font-black">신뢰하기 어려운 정보</p>
            </div>
            <ul className="space-y-1.5 text-xs leading-relaxed text-red-900/80">
              <li>· “비행기 다 멈췄대” — 출처 없는 SNS·단톡</li>
              <li>· “내일 서울 화산재” — 과장·확인 안 된 예측</li>
              <li>· “우리나라는 멀어서 괜찮아” — 근거 없는 안심</li>
            </ul>
            <p className="mt-3 text-[11px] font-medium text-red-800/70">
              재난 때 가짜뉴스는 공포·사재기·잘못된 대피로 이어질 수 있습니다.
            </p>
          </div>
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4">
            <div className="mb-2 flex items-center gap-2 text-emerald-800">
              <ShieldCheck size={16} />
              <p className="text-xs font-black">먼저 확인할 공식 채널</p>
            </div>
            <ul className="space-y-1.5 text-xs leading-relaxed text-emerald-950/80">
              <li>· 행정안전부 긴급재난문자·공식 발표</li>
              <li>· 기상청 화산·지진 관측·통보 (이 사이트 실시간)</li>
              <li>· 국민재난안전포털 행동요령 · 지자체 안내</li>
            </ul>
            <p className="mt-3 text-[11px] font-medium text-emerald-900/70">
              “누가 발표했는지”가 보이면 믿을 수 있습니다.
            </p>
          </div>
        </div>

        {/* 지금 확인할 3가지 */}
        <div className="mt-8">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            지금 확인할 3가지
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            <CheckCard
              n="01"
              title="경보 단계"
              href="/alerts"
              cta="단계별 행동 보기"
              body={
                <>
                  <span className={`font-black ${level.textClass}`}>{level.nameKo}</span>
                  <span className="text-slate-600"> — {level.citizenAction}</span>
                </>
              }
            />
            <CheckCard
              n="02"
              title="최신 관측 (기상청)"
              href="/live"
              cta="실시간 목록·지도"
              body={
                latestVol || latestEq ? (
                  <>
                    {latestVol && (
                      <span>
                        화산 {latestVol.volcanoName ?? "—"}
                        {latestVol.plumeHeightKm != null
                          ? ` · ${latestVol.plumeHeightKm}km`
                          : ""}
                      </span>
                    )}
                    {latestVol && latestEq && " / "}
                    {latestEq && (
                      <span>
                        지진 M{latestEq.magnitude.toFixed(1)} · {latestEq.location}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-slate-500">기상청 데이터 수신 중…</span>
                )
              }
            />
            <CheckCard
              n="03"
              title="내가 할 일"
              href="/guidelines"
              cta="행동요령 바로가기"
              body={<span>{level.citizenAction}</span>}
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <MiniStat
            icon={ListChecks}
            label="위기경보"
            value={level.nameKo}
            sub={level.nameEn}
            accent={level.color}
          />
          <MiniStat
            icon={Mountain}
            label="화산정보"
            value={`${volData.length}건`}
            sub={latestVol ? formatKst(latestVol.announcedAt) : "—"}
          />
          <MiniStat
            icon={Waves}
            label="최근 지진"
            value={`${eqData.length}건`}
            sub={
              eqData.length
                ? `최대 M${Math.max(...eqData.map((e) => e.magnitude)).toFixed(1)}`
                : "—"
            }
          />
          <MiniStat
            icon={Activity}
            label="데이터 출처"
            value="기상청"
            sub={eqSource === "kma-apihub" ? "API허브" : eqSource ?? "연동"}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <SourceStamp source="화산: API허브 selectVolcInfoList" updatedAt={volRefresh} />
          <SourceStamp source="지진: API허브 eqk_now" updatedAt={eqRefresh} />
        </div>
        <p className="mt-3 text-[11px] text-slate-400">
          ※ 실시간 관측은 기상청 발표 그대로이며, 백두산 분화 상황을 의미하지 않습니다.
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
      className="group block rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-[#0B2B66]/30 hover:shadow-md"
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-black text-slate-300">{n}</span>
        <ArrowRight
          size={14}
          className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-[#0B2B66]"
        />
      </div>
      <p className="text-xs font-bold text-[#0B2B66]">{title}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-slate-700 line-clamp-3">{body}</p>
      <p className="mt-2 text-[10px] font-bold text-[#0B2B66]/70 group-hover:text-[#0B2B66]">
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
    <div className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
      <div className="mb-1.5 flex items-center gap-1.5 text-slate-500">
        <Icon size={13} style={accent ? { color: accent } : undefined} />
        <span className="text-[10px] font-bold uppercase tracking-wide">{label}</span>
      </div>
      <p
        className="truncate text-lg font-black text-[#0B2B66]"
        style={accent ? { color: accent } : undefined}
      >
        {value}
      </p>
      <p className="mt-0.5 truncate text-[10px] text-slate-500">{sub}</p>
    </div>
  );
}
