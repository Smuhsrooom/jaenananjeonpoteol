/**
 * 백두산 화산재 확산 — 교육용 시나리오
 *
 * SVG 각도 (y↓, rotate는 +x에서 시계방향). 화살 머리 = 화산재 진행 방향:
 *   겨울   45°  ↘ SE  (NW→SE 북서풍)
 *   여름  315°  ↗ NE  (SW→NE 남서풍)
 *   봄가을  0°  → E   (W→E 편서풍)
 *
 * 공통: spine · plumePolygon · windSvgDeg 가 동일 단위 벡터를 공유한다.
 * 플룸은 항상 백두산(빨간 원)을 시점으로 장축 방향으로만 뻗는다.
 */

export type SeasonId = "winter" | "summer" | "transition";
export type FlightStatus = "cancel" | "delay" | "open" | "watch";

export interface Point {
  x: number;
  y: number;
}

export interface AshTarget {
  id: string;
  kind: "city" | "airport";
  x: number;
  y: number;
  inPlume: boolean;
  arrivalHours: number | null;
  density: number;
  status: FlightStatus;
  pathT: number;
}

export interface SeasonScenario {
  id: SeasonId;
  windSvgDeg: number;
  windLabel: string;
  spine: Point[];
  plumePolygon: Point[];
  revealRadius: number;
  horizonHours: number;
  targets: AshTarget[];
  noteKey: string;
}

/** 백두산 — 빨간 원 중심 = 플룸·바람 공통 원점 */
export const BAEKDU: Point = { x: 195, y: 62 };

export const GEO = {
  seoul: { x: 168, y: 252 },
  icn: { x: 145, y: 242 },
  gmp: { x: 158, y: 258 },
  busan: { x: 252, y: 398 },
  pus: { x: 240, y: 386 },
  jeju: { x: 132, y: 478 },
  cju: { x: 120, y: 468 },
} as const;

function unit(svgDeg: number): Point {
  const rad = (svgDeg * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

function spineAlong(svgDeg: number, distances: number[]): Point[] {
  const u = unit(svgDeg);
  return [
    { ...BAEKDU },
    ...distances.map((d) => ({
      x: BAEKDU.x + u.x * d,
      y: BAEKDU.y + u.y * d,
    })),
  ];
}

type HalfPair = { plus: number; minus: number };

function asPair(h: number | HalfPair): HalfPair {
  return typeof h === "number" ? { plus: h, minus: h } : h;
}

/**
 * 백두산 시점 · 바람 벡터와 평행한 부채꼴/리본 플룸
 * halfNear → halfFar 로 폭이 늘며 (부채꼴),
 * plus/minus 로 장축 좌우 비대칭 가능 (바다 쪽 슬림).
 */
function plumeParallel(
  svgDeg: number,
  length: number,
  halfNear: number | HalfPair,
  halfFar: number | HalfPair,
  steps = 16,
): Point[] {
  const u = unit(svgDeg);
  const px = -u.y;
  const py = u.x;
  const rad = (svgDeg * Math.PI) / 180;
  const near = asPair(halfNear);
  const far = asPair(halfFar);

  const right: Point[] = [];
  const left: Point[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // 부드러운 부채꼴: 초반은 좁고, 중반부터 내륙 쪽으로 확장
    const te = Math.pow(t, 0.85);
    const hp = near.plus * (1 - te) + far.plus * te;
    const hm = near.minus * (1 - te) + far.minus * te;
    const cx = BAEKDU.x + u.x * (t * length);
    const cy = BAEKDU.y + u.y * (t * length);
    right.push({ x: cx + px * hp, y: cy + py * hp });
    left.push({ x: cx - px * hm, y: cy - py * hm });
  }

  const farCx = BAEKDU.x + u.x * length;
  const farCy = BAEKDU.y + u.y * length;
  const tip: Point[] = [];
  // 비대칭 타원 캡
  for (let i = 0; i <= 10; i++) {
    const a = rad - Math.PI / 2 + (Math.PI * i) / 10;
    // plus 쪽 / minus 쪽 반경 보간
    const side = Math.sin(a - rad); // >0 plus 쪽 대략
    const r = side >= 0 ? far.plus : far.minus;
    tip.push({
      x: farCx + Math.cos(a) * r,
      y: farCy + Math.sin(a) * r,
    });
  }

  return [...right, ...tip, ...left.reverse()];
}

/** 점이 폴리곤 안인지 (검증·문서용) */
export function pointInPolygon(pt: Point, poly: Point[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i].x;
    const yi = poly[i].y;
    const xj = poly[j].x;
    const yj = poly[j].y;
    const inter =
      yi > pt.y !== yj > pt.y &&
      pt.x < ((xj - xi) * (pt.y - yi)) / (yj - yi + 1e-9) + xi;
    if (inter) inside = !inside;
  }
  return inside;
}

/** 축까지 수직거리 (검증용) */
function distToAxis(pt: Point, svgDeg: number): number {
  const u = unit(svgDeg);
  const vx = pt.x - BAEKDU.x;
  const vy = pt.y - BAEKDU.y;
  // |v × u| in 2d
  return Math.abs(vx * u.y - vy * u.x);
}

// ---- 폭 튜닝 ----
// SE 45°: 도시들은 +perp(내륙) 쪽. 바다(-perp)는 슬림.
// 서울~153, 김포~165, 부산~197 (plus 쪽) / 제주~339 OUT
const WINTER_DEG = 45;
const SUMMER_DEG = 315;
const TRANS_DEG = 0;

// 겨울: 장축 ↘ 유지 · 바다쪽 슬림 · 내륙쪽만 도시 커버
// 예전 대칭 반폭 190~220(총~400) → 비대칭 총폭 ~200~280 부채꼴
const winterPlume = plumeParallel(
  WINTER_DEG,
  500,
  { plus: 165, minus: 40 },
  { plus: 230, minus: 50 },
  18,
);
const summerPlume = plumeParallel(SUMMER_DEG, 340, 32, 58, 14);
const transPlume = plumeParallel(TRANS_DEG, 360, 22, 38, 14);

export const SEASON_SCENARIOS: Record<SeasonId, SeasonScenario> = {
  /**
   * 1) 겨울 NW→SE
   * WIND ↘ 45° · 플룸 동일 ↘
   * 서울·김포·부산(김해) IN · 제주 공항 OUT
   */
  winter: {
    id: "winter",
    windSvgDeg: WINTER_DEG,
    windLabel: "NW→SE",
    horizonHours: 36,
    noteKey: "winter",
    revealRadius: 560,
    spine: spineAlong(WINTER_DEG, [55, 120, 190, 270, 350, 430, 510]),
    plumePolygon: winterPlume,
    targets: [
      {
        id: "seoul",
        kind: "city",
        ...GEO.seoul,
        inPlume: true,
        arrivalHours: 9,
        density: 0.8,
        status: "cancel",
        pathT: 0.32,
      },
      {
        id: "icn",
        kind: "airport",
        ...GEO.icn,
        inPlume: true,
        arrivalHours: 10,
        density: 0.76,
        status: "cancel",
        pathT: 0.33,
      },
      {
        id: "gmp",
        kind: "airport",
        ...GEO.gmp,
        inPlume: true,
        arrivalHours: 10,
        density: 0.78,
        status: "cancel",
        pathT: 0.34,
      },
      {
        id: "busan",
        kind: "city",
        ...GEO.busan,
        inPlume: true,
        arrivalHours: 18,
        density: 0.65,
        status: "cancel",
        pathT: 0.64,
      },
      {
        id: "pus",
        kind: "airport",
        ...GEO.pus,
        inPlume: true,
        arrivalHours: 17,
        density: 0.66,
        status: "cancel",
        pathT: 0.62,
      },
      // 제주: 범위 밖 (안전)
      {
        id: "jeju",
        kind: "city",
        ...GEO.jeju,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
      {
        id: "cju",
        kind: "airport",
        ...GEO.cju,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
    ],
  },

  /**
   * 2) 여름 SW→NE
   * WIND ↗ 315° · 플룸 동일 ↗ (연해주·러시아)
   * 한반도 전역 OUT
   */
  summer: {
    id: "summer",
    windSvgDeg: SUMMER_DEG,
    windLabel: "SW→NE",
    horizonHours: 40,
    noteKey: "summer",
    revealRadius: 380,
    spine: spineAlong(SUMMER_DEG, [45, 100, 160, 220, 280, 340]),
    plumePolygon: summerPlume,
    targets: [
      {
        id: "seoul",
        kind: "city",
        ...GEO.seoul,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
      {
        id: "icn",
        kind: "airport",
        ...GEO.icn,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
      {
        id: "gmp",
        kind: "airport",
        ...GEO.gmp,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
      {
        id: "busan",
        kind: "city",
        ...GEO.busan,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
      {
        id: "pus",
        kind: "airport",
        ...GEO.pus,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
      {
        id: "jeju",
        kind: "city",
        ...GEO.jeju,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
      {
        id: "cju",
        kind: "airport",
        ...GEO.cju,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
    ],
  },

  /**
   * 3) 봄·가을 W→E
   * WIND → 0° · 플룸 동일 → (일본 북부)
   * 한반도 전역 OUT
   */
  transition: {
    id: "transition",
    windSvgDeg: TRANS_DEG,
    windLabel: "W→E",
    horizonHours: 36,
    noteKey: "transition",
    revealRadius: 380,
    spine: spineAlong(TRANS_DEG, [50, 110, 170, 240, 310, 380]),
    plumePolygon: transPlume,
    targets: [
      {
        id: "seoul",
        kind: "city",
        ...GEO.seoul,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
      {
        id: "icn",
        kind: "airport",
        ...GEO.icn,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
      {
        id: "gmp",
        kind: "airport",
        ...GEO.gmp,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
      {
        id: "busan",
        kind: "city",
        ...GEO.busan,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
      {
        id: "pus",
        kind: "airport",
        ...GEO.pus,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
      {
        id: "jeju",
        kind: "city",
        ...GEO.jeju,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
      {
        id: "cju",
        kind: "airport",
        ...GEO.cju,
        inPlume: false,
        arrivalHours: null,
        density: 0,
        status: "open",
        pathT: 0,
      },
    ],
  },
};

// 개발 시 콘솔에서 포함 관계 확인 가능
export function debugPlumeCoverage() {
  const check = (name: string, poly: Point[], deg: number) => {
    const ids = ["seoul", "gmp", "pus", "busan", "cju", "jeju"] as const;
    return ids.map((id) => {
      const p = GEO[id];
      return {
        id,
        in: pointInPolygon(p, poly),
        axisDist: Math.round(distToAxis(p, deg)),
      };
    });
  };
  return {
    winter: check("winter", winterPlume, WINTER_DEG),
    summer: check("summer", summerPlume, SUMMER_DEG),
    transition: check("transition", transPlume, TRANS_DEG),
  };
}

export const SEASON_ORDER: SeasonId[] = ["winter", "summer", "transition"];

export const TARGET_LABEL_KEYS: Record<string, string> = {
  seoul: "sim.target.seoul",
  busan: "sim.target.busan",
  jeju: "sim.target.jeju",
  icn: "sim.target.icn",
  gmp: "sim.target.gmp",
  pus: "sim.target.pus",
  cju: "sim.target.cju",
};

export const SIM_DURATION_MS = 16000;

export function pointsToPath(pts: Point[]): string {
  if (pts.length === 0) return "";
  return (
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("") + "Z"
  );
}

export function pointsToPolyline(pts: Point[]): string {
  if (pts.length === 0) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join("");
}

export function polylineLength(pts: Point[]): number {
  let len = 0;
  for (let i = 1; i < pts.length; i++) {
    len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  }
  return len || 1;
}

export function pointOnPath(pts: Point[], t: number): Point {
  if (pts.length === 0) return { x: 0, y: 0 };
  if (pts.length === 1 || t <= 0) return { ...pts[0] };
  if (t >= 1) return { ...pts[pts.length - 1] };
  const total = polylineLength(pts);
  let remain = total * t;
  for (let i = 1; i < pts.length; i++) {
    const dx = pts[i].x - pts[i - 1].x;
    const dy = pts[i].y - pts[i - 1].y;
    const seg = Math.hypot(dx, dy);
    if (remain <= seg || i === pts.length - 1) {
      const r = seg === 0 ? 0 : Math.min(1, remain / seg);
      return { x: pts[i - 1].x + dx * r, y: pts[i - 1].y + dy * r };
    }
    remain -= seg;
  }
  return { ...pts[pts.length - 1] };
}
