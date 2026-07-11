import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Plane,
  MapPin,
  Wind,
  AlertTriangle,
  CloudFog,
  ShieldOff,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader";
import SourceStamp from "@/components/SourceStamp";
import Reveal from "@/components/motion/Reveal";
import { useT } from "@/i18n/I18nContext";
import {
  BAEKDU,
  SEASON_ORDER,
  SEASON_SCENARIOS,
  SIM_DURATION_MS,
  TARGET_LABEL_KEYS,
  pointOnPath,
  pointsToPath,
  pointsToPolyline,
  polylineLength,
  type FlightStatus,
  type SeasonId,
} from "@/lib/ashSimulation";

type Phase = "idle" | "running" | "paused" | "done";

function statusStyle(status: FlightStatus) {
  switch (status) {
    case "cancel":
      return {
        bar: "bg-red-500",
        badge: "text-red-800",
        badgeBg: "bg-red-100 border-red-200",
      };
    case "delay":
      return {
        bar: "bg-amber-500",
        badge: "text-amber-900",
        badgeBg: "bg-amber-100 border-amber-200",
      };
    case "watch":
      return {
        bar: "bg-sky-500",
        badge: "text-sky-900",
        badgeBg: "bg-sky-100 border-sky-200",
      };
    default:
      return {
        bar: "bg-emerald-500",
        badge: "text-emerald-900",
        badgeBg: "bg-emerald-100 border-emerald-200",
      };
  }
}

function formatHours(h: number, unit: string): string {
  if (h < 1) return `<1${unit}`;
  if (Number.isInteger(h)) return `${h}${unit}`;
  return `${h.toFixed(1)}${unit}`;
}

export default function AshSimulationSection() {
  const t = useT();
  const uid = useId().replace(/:/g, "");
  /** 바람 축 방향으로만 열리는 리빌 클립 (원형 금지) */
  const axisClipId = `plume-axis-${uid}`;

  const [season, setSeason] = useState<SeasonId>("winter");
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef(0);
  const progressRef = useRef(0);

  const scenario = SEASON_SCENARIOS[season];
  const sortedTargets = useMemo(
    () =>
      [...scenario.targets].sort((a, b) => {
        // 영향권 안을 먼저, 그다음 ETA
        if (a.inPlume !== b.inPlume) return a.inPlume ? -1 : 1;
        const ah = a.arrivalHours ?? 999;
        const bh = b.arrivalHours ?? 999;
        return ah - bh;
      }),
    [scenario],
  );

  const plumeD = useMemo(() => pointsToPath(scenario.plumePolygon), [scenario]);
  const spineD = useMemo(() => pointsToPolyline(scenario.spine), [scenario]);
  const spineLen = useMemo(() => polylineLength(scenario.spine), [scenario]);

  const simHours = progress * scenario.horizonHours;
  const plumeT = phase === "idle" ? 0 : progress;
  /** 바람 축 방향 리빌 길이 (원형 클립 사용 안 함 — 구형 덩어리 방지) */
  const axisRevealLen =
    phase === "idle" ? 0 : Math.max(12, plumeT * scenario.revealRadius);
  const plumeHead = useMemo(
    () => pointOnPath(scenario.spine, plumeT),
    [scenario.spine, plumeT],
  );

  const stopRaf = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }, []);

  const tick = useCallback((now: number) => {
    const elapsed = now - startRef.current;
    const p = Math.min(1, elapsed / SIM_DURATION_MS);
    progressRef.current = p;
    setProgress(p);
    if (p >= 1) {
      setPhase("done");
      rafRef.current = null;
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const start = () => {
    stopRaf();
    progressRef.current = 0;
    setProgress(0);
    startRef.current = performance.now();
    setPhase("running");
    rafRef.current = requestAnimationFrame(tick);
  };

  const pause = () => {
    if (phase !== "running") return;
    stopRaf();
    setPhase("paused");
  };

  const resume = () => {
    if (phase !== "paused") return;
    startRef.current = performance.now() - progressRef.current * SIM_DURATION_MS;
    setPhase("running");
    rafRef.current = requestAnimationFrame(tick);
  };

  const reset = useCallback(() => {
    stopRaf();
    progressRef.current = 0;
    setProgress(0);
    setPhase("idle");
  }, [stopRaf]);

  useEffect(() => {
    reset();
  }, [season, reset]);

  useEffect(() => () => stopRaf(), [stopRaf]);

  const arrivedCount = sortedTargets.filter(
    (tg) =>
      tg.inPlume &&
      tg.arrivalHours != null &&
      phase !== "idle" &&
      simHours >= tg.arrivalHours,
  ).length;
  const inPlumeCount = sortedTargets.filter((tg) => tg.inPlume).length;

  return (
    <section id="ash-simulation" className="border-b border-slate-200 bg-[#FAFBFC] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeader
          eyebrow={t("sim.eyebrow")}
          title={t("sim.title")}
          description={t("sim.description")}
          action={<SourceStamp source={t("sim.stamp")} />}
        />

        <Reveal className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
          <div className="flex gap-2">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
            <p>{t("sim.disclaimer")}</p>
          </div>
        </Reveal>

        <Reveal className="mb-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-500">
            {t("sim.seasonLabel")}
          </p>
          <div className="grid gap-2 sm:grid-cols-3">
            {SEASON_ORDER.map((id) => {
              const active = season === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSeason(id)}
                  disabled={phase === "running"}
                  className={`rounded-xl border-2 px-3 py-3 text-left transition ${
                    active
                      ? "border-[#0B2B66] bg-[#0B2B66] text-white shadow-sm"
                      : "border-slate-200 bg-slate-50 text-slate-800 hover:border-slate-300 disabled:opacity-60"
                  }`}
                >
                  <span className="flex items-center gap-2 text-sm font-black sm:text-base">
                    <Wind size={16} className={active ? "text-amber-300" : "text-slate-400"} />
                    {t(`sim.season.${id}`)}
                  </span>
                  <span
                    className={`mt-1 block text-xs sm:text-sm ${
                      active ? "text-blue-100" : "text-slate-500"
                    }`}
                  >
                    {t(`sim.season.${id}Desc`)}
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-3 rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs leading-relaxed text-slate-600 sm:text-sm">
            {t(`sim.seasonNote.${scenario.noteKey}`)}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {(phase === "idle" || phase === "done") && (
              <button
                type="button"
                onClick={start}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B66] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#081f4a]"
              >
                <Play size={16} fill="currentColor" />
                {phase === "done" ? t("sim.restart") : t("sim.start")}
              </button>
            )}
            {phase === "running" && (
              <button
                type="button"
                onClick={pause}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-800 hover:bg-slate-50"
              >
                <Pause size={16} />
                {t("sim.pause")}
              </button>
            )}
            {phase === "paused" && (
              <button
                type="button"
                onClick={resume}
                className="inline-flex items-center gap-2 rounded-xl bg-[#0B2B66] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#081f4a]"
              >
                <Play size={16} fill="currentColor" />
                {t("sim.resume")}
              </button>
            )}
            {phase !== "idle" && (
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                <RotateCcw size={15} />
                {t("sim.reset")}
              </button>
            )}
            <div className="ml-auto flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5 font-semibold">
                <CloudFog size={15} className="text-slate-400" />
                {t("sim.clock", {
                  h: simHours.toFixed(1),
                  max: String(scenario.horizonHours),
                })}
              </span>
              <span className="tabular-nums text-slate-500">
                {t("sim.arrived", { n: arrivedCount, total: inPlumeCount })}
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-1 flex justify-between text-xs font-semibold text-slate-500">
              <span>{t("sim.globalProgress")}</span>
              <span className="tabular-nums">{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100 ring-1 ring-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-amber-500 to-red-500"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </Reveal>

        <div className="grid gap-6 lg:grid-cols-5">
          {/* Map */}
          <Reveal className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                <p className="text-sm font-bold text-[#0B2B66]">{t("sim.mapTitle")}</p>
                <span className="font-mono text-[10px] font-bold tracking-wide text-emerald-700">
                  PLUME · {scenario.windLabel}
                </span>
              </div>
              <div className="relative bg-gradient-to-b from-sky-50 to-slate-50 p-3 sm:p-4">
                <svg
                  viewBox="-30 -100 500 640"
                  className="mx-auto h-auto w-full max-w-md"
                  role="img"
                  aria-label={t("sim.mapAria")}
                >
                  <defs>
                    {/*
                      바람 축 방향 리빌만 사용.
                      원형 clip은 구형 덩어리처럼 보이므로 제거함.
                    */}
                    <clipPath id={axisClipId}>
                      <rect
                        x={0}
                        y={-280}
                        width={axisRevealLen}
                        height={560}
                        transform={`translate(${BAEKDU.x} ${BAEKDU.y}) rotate(${scenario.windSvgDeg})`}
                      />
                    </clipPath>
                    <linearGradient
                      id={`${uid}-plume-fill`}
                      gradientUnits="userSpaceOnUse"
                      x1={BAEKDU.x}
                      y1={BAEKDU.y}
                      x2={BAEKDU.x + Math.cos((scenario.windSvgDeg * Math.PI) / 180) * 400}
                      y2={BAEKDU.y + Math.sin((scenario.windSvgDeg * Math.PI) / 180) * 400}
                    >
                      <stop offset="0%" stopColor="#4ade80" stopOpacity="0.75" />
                      <stop offset="100%" stopColor="#15803d" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>

                  {/* 바다 */}
                  <rect x="-30" y="-100" width="500" height="640" fill="#cfe4f4" />

                  <text x="340" y="-40" fill="#64748b" style={{ fontSize: 10, fontWeight: 700 }}>
                    {t("sim.geoNe")}
                  </text>
                  <text x="400" y="90" fill="#64748b" style={{ fontSize: 10, fontWeight: 700 }}>
                    {t("sim.geoE")}
                  </text>

                  {/* 한반도 (연한 육지색 — 화산재 레이어 아님) */}
                  <path
                    d="
                      M188 48
                      L225 52 L248 78 L258 120 L252 165
                      L246 210 L242 255 L250 305 L258 350
                      L272 390 L268 430 L248 458 L210 468
                      L172 452 L152 410 L142 360 L138 310
                      L140 265 L150 220 L160 175 L172 125
                      L180 85 L185 58 Z
                    "
                    fill="#e8efe3"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />
                  <ellipse
                    cx="128"
                    cy="478"
                    rx="30"
                    ry="16"
                    fill="#e8efe3"
                    stroke="#94a3b8"
                    strokeWidth="1.5"
                  />

                  <g stroke="#94a3b8" strokeWidth="0.35" opacity="0.25">
                    {Array.from({ length: 11 }).map((_, i) => (
                      <line key={`h${i}`} x1="0" y1={i * 52} x2="420" y2={i * 52} />
                    ))}
                    {Array.from({ length: 9 }).map((_, i) => (
                      <line key={`v${i}`} x1={i * 52.5} y1="0" x2={i * 52.5} y2="520" />
                    ))}
                  </g>

                  {/*
                    ★ 화산재 플룸 단일 레이어
                    - idle: 점선 윤곽만 (채움 없음 → 구형/남서 덩어리 제거)
                    - running/done: 같은 폴리곤을 바람 축 방향으로만 채움
                  */}
                  {phase === "idle" ? (
                    <path
                      key={`plume-outline-${season}`}
                      d={plumeD}
                      fill="none"
                      stroke="#15803d"
                      strokeWidth="2.5"
                      strokeDasharray="7 5"
                      strokeLinejoin="round"
                      opacity="0.95"
                    />
                  ) : (
                    <g key={`plume-fill-${season}`} clipPath={`url(#${axisClipId})`}>
                      <path
                        d={plumeD}
                        fill={`url(#${uid}-plume-fill)`}
                        stroke="#15803d"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </g>
                  )}

                  {phase !== "idle" && (
                    <path
                      d={spineD}
                      fill="none"
                      stroke="#ea580c"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeDasharray={spineLen}
                      strokeDashoffset={spineLen * (1 - plumeT)}
                      opacity="0.9"
                    />
                  )}

                  {phase !== "idle" && progress > 0.02 && (
                    <circle cx={plumeHead.x} cy={plumeHead.y} r="5" fill="#9a3412" />
                  )}

                  {/*
                    WIND 화살표: SVG +x 기준 시계방향 windSvgDeg
                    화살 머리 = 화산재 진행 방향 = 플룸 장축과 동일
                  */}
                  <g
                    transform={`translate(${BAEKDU.x},${BAEKDU.y}) rotate(${scenario.windSvgDeg})`}
                  >
                    {/* 화살 몸통: 백두산에서 진행 방향으로 */}
                    <line
                      x1="14"
                      y1="0"
                      x2="78"
                      y2="0"
                      stroke="#0B2B66"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    <polygon points="82,0 62,-11 62,11" fill="#0B2B66" />
                    {/* 바람 기원 쪽 작은 꼬리 */}
                    <line
                      x1="-18"
                      y1="0"
                      x2="10"
                      y2="0"
                      stroke="#0B2B66"
                      strokeWidth="2"
                      strokeLinecap="round"
                      opacity="0.45"
                      strokeDasharray="4 3"
                    />
                  </g>
                  {/* 라벨은 화살 옆(진행 방향 수직 오프셋) */}
                  <text
                    x={
                      BAEKDU.x +
                      Math.cos(((scenario.windSvgDeg - 90) * Math.PI) / 180) * 28 +
                      Math.cos((scenario.windSvgDeg * Math.PI) / 180) * 48
                    }
                    y={
                      BAEKDU.y +
                      Math.sin(((scenario.windSvgDeg - 90) * Math.PI) / 180) * 28 +
                      Math.sin((scenario.windSvgDeg * Math.PI) / 180) * 48
                    }
                    textAnchor="middle"
                    fill="#0B2B66"
                    style={{ fontSize: 11, fontWeight: 800 }}
                  >
                    WIND {scenario.windLabel}
                  </text>

                  {/* 백두산 */}
                  <g>
                    <circle cx={BAEKDU.x} cy={BAEKDU.y} r="11" fill="#7f1d1d" />
                    {phase === "running" && (
                      <circle
                        cx={BAEKDU.x}
                        cy={BAEKDU.y}
                        r="16"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        opacity="0.65"
                      >
                        <animate
                          attributeName="r"
                          values="12;22;12"
                          dur="1.4s"
                          repeatCount="indefinite"
                        />
                        <animate
                          attributeName="opacity"
                          values="0.7;0.15;0.7"
                          dur="1.4s"
                          repeatCount="indefinite"
                        />
                      </circle>
                    )}
                    <text
                      x={BAEKDU.x}
                      y={BAEKDU.y - 16}
                      textAnchor="middle"
                      fill="#1e293b"
                      style={{ fontSize: 11, fontWeight: 800 }}
                    >
                      {t("sim.baekdu")}
                    </text>
                  </g>

                  {/* 도시·공항 */}
                  {sortedTargets.map((tg) => {
                    const hit =
                      tg.inPlume &&
                      tg.arrivalHours != null &&
                      phase !== "idle" &&
                      simHours >= tg.arrivalHours;
                    const approaching =
                      tg.inPlume &&
                      tg.arrivalHours != null &&
                      phase !== "idle" &&
                      !hit &&
                      simHours >= tg.arrivalHours * 0.55;
                    const outside = !tg.inPlume;

                    return (
                      <g key={tg.id} opacity={outside ? 0.55 : 1}>
                        {hit && (
                          <circle
                            cx={tg.x}
                            cy={tg.y}
                            r={12 + tg.density * 8}
                            fill="#fca5a5"
                            opacity="0.5"
                          />
                        )}
                        {tg.kind === "airport" ? (
                          <rect
                            x={tg.x - 5}
                            y={tg.y - 5}
                            width="10"
                            height="10"
                            fill={
                              outside
                                ? "#94a3b8"
                                : hit
                                  ? "#dc2626"
                                  : approaching
                                    ? "#f59e0b"
                                    : "#0B2B66"
                            }
                            transform={`rotate(45 ${tg.x} ${tg.y})`}
                          />
                        ) : (
                          <circle
                            cx={tg.x}
                            cy={tg.y}
                            r="5.5"
                            fill={
                              outside
                                ? "#94a3b8"
                                : hit
                                  ? "#dc2626"
                                  : approaching
                                    ? "#f59e0b"
                                    : "#0B2B66"
                            }
                            stroke="#fff"
                            strokeWidth="1.5"
                          />
                        )}
                        <text
                          x={tg.x + 10}
                          y={tg.y + 4}
                          fill={outside ? "#94a3b8" : hit ? "#991b1b" : "#334155"}
                          style={{ fontSize: 10, fontWeight: 700 }}
                        >
                          {t(TARGET_LABEL_KEYS[tg.id] ?? tg.id)}
                          {outside ? " ✕" : ""}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="mt-2 flex flex-wrap gap-3 px-1 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2.5 w-3 rounded-sm bg-emerald-500/70" />
                    {t("sim.legendPlume")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#0B2B66]" />
                    {t("sim.legendCity")}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <span className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                    {t("sim.legendOutside")}
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Timeline */}
          <Reveal className="lg:col-span-3">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-slate-50 px-4 py-2.5">
                <p className="text-sm font-bold text-[#0B2B66]">{t("sim.timelineTitle")}</p>
                <p className="mt-0.5 text-xs text-slate-500">{t("sim.timelineHint")}</p>
              </div>
              <ul className="divide-y divide-slate-100">
                {sortedTargets.map((tg, idx) => {
                  const outside = !tg.inPlume;
                  const hit =
                    !outside &&
                    tg.arrivalHours != null &&
                    phase !== "idle" &&
                    simHours >= tg.arrivalHours;
                  const localProgress =
                    outside || phase === "idle" || tg.arrivalHours == null
                      ? 0
                      : Math.min(1, simHours / tg.arrivalHours);
                  const st = statusStyle(tg.status);
                  const label = t(TARGET_LABEL_KEYS[tg.id] ?? tg.id);

                  let statusLabel: string;
                  let badgeClass: string;
                  if (outside) {
                    statusLabel = t("sim.statusOutside");
                    badgeClass = "bg-slate-100 border-slate-200 text-slate-600";
                  } else if (hit) {
                    statusLabel = t(`sim.status.${tg.status}`);
                    badgeClass = `${st.badgeBg} ${st.badge}`;
                  } else if (phase === "idle") {
                    statusLabel = t("sim.statusPending");
                    badgeClass = "bg-slate-100 border-slate-200 text-slate-600";
                  } else {
                    statusLabel = t("sim.enRoute");
                    badgeClass = "bg-amber-50 border-amber-200 text-amber-900";
                  }

                  return (
                    <li
                      key={tg.id}
                      className={`px-4 py-3.5 transition-colors sm:px-5 ${
                        outside
                          ? "bg-slate-50/80"
                          : hit
                            ? "bg-red-50/70"
                            : "bg-white"
                      }`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex min-w-0 items-start gap-2.5">
                          <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-xs font-black text-slate-500">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <div className="min-w-0">
                            <p className="flex flex-wrap items-center gap-1.5 text-sm font-bold text-slate-900 sm:text-base">
                              {outside ? (
                                <ShieldOff size={14} className="text-slate-400" />
                              ) : tg.kind === "airport" ? (
                                <Plane size={14} className="text-slate-400" />
                              ) : (
                                <MapPin size={14} className="text-slate-400" />
                              )}
                              {label}
                              <span className="text-xs font-semibold text-slate-400">
                                {tg.kind === "airport" ? t("sim.kindAirport") : t("sim.kindCity")}
                              </span>
                            </p>
                            <p className="mt-0.5 text-xs text-slate-500 sm:text-sm">
                              {outside
                                ? t("sim.outsideHint")
                                : `${t("sim.eta", {
                                    h: formatHours(tg.arrivalHours ?? 0, t("sim.hourUnit")),
                                  })} · ${t("sim.density", {
                                    n: Math.round(tg.density * 100),
                                  })}`}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-bold ${badgeClass}`}
                        >
                          {statusLabel}
                        </span>
                      </div>

                      <div className="mt-2.5">
                        <div className="mb-1 flex justify-between text-[11px] font-semibold text-slate-400">
                          <span>
                            {outside
                              ? t("sim.outsideBar")
                              : hit
                                ? t("sim.arrivedBadge")
                                : phase === "idle"
                                  ? t("sim.waiting")
                                  : t("sim.enRoute")}
                          </span>
                          <span className="tabular-nums">
                            {outside ? "—" : `${Math.round(localProgress * 100)}%`}
                          </span>
                        </div>
                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              outside
                                ? "bg-slate-300"
                                : hit
                                  ? "bg-red-500"
                                  : st.bar
                            }`}
                            style={{
                              width: outside ? "100%" : `${localProgress * 100}%`,
                              opacity: outside ? 0.35 : 1,
                            }}
                          />
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {phase === "done" && (
              <div className="mt-4 rounded-2xl border border-[#0B2B66]/20 bg-[#0B2B66] px-4 py-4 text-white sm:px-5">
                <p className="text-sm font-black sm:text-base">{t("sim.doneTitle")}</p>
                <p className="mt-1 text-sm leading-relaxed text-blue-100">{t("sim.doneBody")}</p>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
