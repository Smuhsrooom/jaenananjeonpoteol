/** 기상청 API허브 — 화산정보 목록 selectVolcInfoList.do */

export interface VolcanoEvent {
  id: string;
  title: string;
  volcanoName: string | null;
  location: string | null;
  announcedAt: string | null;
  eruptedAt: string | null;
  plumeHeightKm: number | null;
  lat: number | null;
  lon: number | null;
  alertLevel: string | null;
  message: string | null;
  raw: Record<string, string>;
}

export type VolcanoSource = "kma-apihub-volc";

export interface VolcanoApiResponse {
  ok: boolean;
  data: VolcanoEvent[];
  fetchedAt: string;
  source: VolcanoSource;
  error?: string;
  /** API 활용신청 필요 등 안내 */
  needsApplication?: boolean;
}

// orderCm=L 은 최신 1건만. 전체 목록은 orderCm 생략 또는 A
const VOLC_LIST_PATH =
  "/api/typ09/url/volc/selectVolcInfoList.do?orderTy=xml";

function pick(raw: Record<string, string>, keys: string[]): string | null {
  for (const k of keys) {
    const hit = Object.entries(raw).find(
      ([rk]) => rk.toLowerCase() === k.toLowerCase() || rk.includes(k),
    );
    if (hit?.[1]?.trim()) return hit[1].trim();
  }
  // 부분 일치
  for (const k of keys) {
    const hit = Object.entries(raw).find(([rk]) =>
      rk.toLowerCase().includes(k.toLowerCase()),
    );
    if (hit?.[1]?.trim()) return hit[1].trim();
  }
  return null;
}

function parseNum(v: string | null): number | null {
  if (v == null || v === "") return null;
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

/** yyyyMMddHHmmss / yyyy-MM-dd ... → ISO */
function parseLooseDate(v: string | null): string | null {
  if (!v) return null;
  const s = v.replace(/\D/g, "");
  if (s.length >= 8) {
    const y = s.slice(0, 4);
    const mo = s.slice(4, 6);
    const d = s.slice(6, 8);
    const h = s.slice(8, 10) || "00";
    const mi = s.slice(10, 12) || "00";
    const se = s.slice(12, 14) || "00";
    const iso = `${y}-${mo}-${d}T${h}:${mi}:${se}+09:00`;
    const t = Date.parse(iso);
    return Number.isNaN(t) ? v : new Date(t).toISOString();
  }
  const t = Date.parse(v);
  return Number.isNaN(t) ? v : new Date(t).toISOString();
}

/**
 * 분연주 높이: API는 m 단위(예: 9100)로 오는 경우가 많음 → km로 환산
 */
function normalizePlumeHeightKm(raw: string | null): number | null {
  const n = parseNum(raw);
  if (n == null) return null;
  // 100 이상이면 미터로 간주
  if (n >= 100) return Math.round((n / 1000) * 10) / 10;
  return n;
}

export function mapVolcanoRaw(raw: Record<string, string>, index: number): VolcanoEvent {
  const volcanoName = pick(raw, [
    "volcName",
    "volcNm",
    "volcanoNm",
    "volName",
    "vltnNm",
    "name",
    "화산명",
  ]);
  const location = pick(raw, [
    "volcLoc",
    "wrnLoc",
    "loc",
    "location",
    "area",
    "region",
    "addr",
    "위치",
    "발생위치",
    "분화위치",
  ]);
  const msgType = pick(raw, ["msgCodeKo", "msgCode", "정보종류", "통보문종류"]);
  const title =
    pick(raw, ["title", "ttl", "msgTitle", "fcstTitle", "제목", "통보제목"]) ||
    (volcanoName
      ? `${msgType ? `${msgType} · ` : ""}${volcanoName}`
      : msgType || `화산정보 #${index + 1}`);
  const message = pick(raw, [
    "refer",
    "release",
    "rem",
    "remark",
    "content",
    "msg",
    "message",
    "fcstCn",
    "t1",
    "내용",
    "참고사항",
    "당부사항",
  ]);
  const announcedAt = parseLooseDate(
    pick(raw, [
      "tmIssue",
      "tmFc",
      "announcedAt",
      "fcstDate",
      "reportDt",
      "발표시각",
      "tm",
    ]),
  );
  const eruptedAt = parseLooseDate(
    pick(raw, [
      "volcTm",
      "tmErpt",
      "eruptDt",
      "erptTm",
      "발생시각",
      "분화시각",
      "tmEqk",
    ]),
  );
  const plumeHeightKm = normalizePlumeHeightKm(
    pick(raw, [
      "volcHtPlume",
      "plumeHgt",
      "plmHt",
      "height",
      "hgt",
      "분연주",
      "기둥높이",
      "plume",
    ]),
  );
  const lat = parseNum(pick(raw, ["volcLat", "lat", "latitude", "위도"]));
  const lon = parseNum(pick(raw, ["volcLon", "lon", "lng", "longitude", "경도"]));
  const ashDir = pick(raw, ["wrnAshDir", "확산방향"]);
  const ashVel = pick(raw, ["wrnAshVelocity", "확산속도"]);
  const alertLevel =
    pick(raw, [
      "msgCodeKo",
      "lvl",
      "level",
      "alertLvl",
      "wrn",
      "fcstGbn",
      "등급",
      "경보",
      "특보",
    ]) || null;
  const id =
    pick(raw, ["seq", "id", "tmSeq", "cnt", "no"]) ||
    `${announcedAt ?? volcanoName ?? "volc"}-${index}`;

  // 확산 정보가 있으면 메시지에 합침
  const extra: string[] = [];
  if (ashDir && ashDir !== "-") extra.push(`확산방향 ${ashDir}`);
  if (ashVel && ashVel !== "-") extra.push(`확산속도 ${ashVel}`);
  const mergedMessage = [message, ...extra].filter(Boolean).join(" · ") || null;

  return {
    id,
    title,
    volcanoName,
    location,
    announcedAt,
    eruptedAt,
    plumeHeightKm,
    lat,
    lon,
    alertLevel,
    message: mergedMessage,
    raw,
  };
}

function extractTagMap(block: string): Record<string, string> {
  const raw: Record<string, string> = {};
  const tags = [...block.matchAll(/<([A-Za-z_][\w.-]*)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g)];
  for (const t of tags) {
    // 중첩 태그 블록은 건너뛰고 리프 값만 (간단 처리: 자식 태그가 있으면 제외)
    if (/<[A-Za-z_]/.test(t[2]) && !t[2].includes("<!--")) {
      // 주석만 있는 경우 허용
      const withoutComments = t[2].replace(/<!--[\s\S]*?-->/g, "").trim();
      if (/<[A-Za-z_]/.test(withoutComments)) continue;
    }
    const val = t[2]
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .trim();
    if (val && val !== "-") raw[t[1]] = val;
  }
  return raw;
}

/**
 * API허브 화산 XML:
 * <alert><volcano><info>...</info></volcano></alert>
 * 및 일반 item/row 래퍼 모두 지원
 */
export function parseXmlItems(xml: string): Record<string, string>[] {
  const items: Record<string, string>[] = [];

  // 1) selectVolcInfoList 실제 포맷: <info>...</info>
  const infoBlocks = [...xml.matchAll(/<info(?:\s[^>]*)?>([\s\S]*?)<\/info>/gi)];
  for (const b of infoBlocks) {
    const raw = extractTagMap(b[1]);
    if (Object.keys(raw).length > 0) items.push(raw);
  }
  if (items.length > 0) return items;

  // 2) 일반 item
  const blocks = [...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)];
  for (const b of blocks) {
    const raw = extractTagMap(b[1]);
    if (Object.keys(raw).length > 0) items.push(raw);
  }
  if (items.length > 0) return items;

  // 3) row / volcano 등
  const alt = [
    ...xml.matchAll(/<(?:row|volcano|data)(?:\s[^>]*)?>([\s\S]*?)<\/(?:row|volcano|data)>/gi),
  ];
  for (const b of alt) {
    const raw = extractTagMap(b[1]);
    if (Object.keys(raw).length > 0) items.push(raw);
  }

  return items;
}

function decodeBody(bytes: Uint8Array): string {
  const utf8 = new TextDecoder("utf-8").decode(bytes);
  if (/[\uAC00-\uD7A3]/.test(utf8) || utf8.trimStart().startsWith("{") || utf8.includes("<?xml")) {
    return utf8;
  }
  try {
    return new TextDecoder("euc-kr").decode(bytes);
  } catch {
    return utf8;
  }
}

export async function fetchVolcanoInfoFromApiHub(
  authKey: string,
): Promise<VolcanoApiResponse> {
  const key = encodeURIComponent(authKey.trim());
  const url = `https://apihub.kma.go.kr${VOLC_LIST_PATH}&authKey=${key}`;

  const res = await fetch(url, {
    headers: {
      Accept: "application/xml, text/xml, application/json, */*",
      "User-Agent": "disaster-safety-portal/1.0 (apihub selectVolcInfoList)",
    },
  });

  const bytes = new Uint8Array(await res.arrayBuffer());
  const text = decodeBody(bytes);

  // JSON 에러 (활용신청 필요 등)
  if (text.trimStart().startsWith("{")) {
    try {
      const j = JSON.parse(text) as {
        result?: { status?: number; message?: string };
      };
      const status = j.result?.status ?? res.status;
      const message = j.result?.message ?? text;
      const needsApplication =
        status === 403 ||
        message.includes("활용신청") ||
        message.includes("신청");
      return {
        ok: false,
        data: [],
        fetchedAt: new Date().toISOString(),
        source: "kma-apihub-volc",
        error: `API허브 화산정보 ${status}: ${message}`,
        needsApplication,
      };
    } catch {
      throw new Error(`API허브 화산 응답 파싱 실패: ${text.slice(0, 120)}`);
    }
  }

  if (!res.ok) {
    throw new Error(`API허브 화산 HTTP ${res.status}: ${text.slice(0, 120)}`);
  }

  // resultCode 오류
  const code = text.match(/<resultCode>([^<]+)<\/resultCode>/i)?.[1];
  const msg = text.match(/<resultMsg>([^<]+)<\/resultMsg>/i)?.[1];
  if (code && code !== "00" && code !== "0") {
    throw new Error(`API허브 화산 오류: ${msg ?? code}`);
  }

  const rawItems = parseXmlItems(text);
  const data = rawItems
    .map((raw, i) => mapVolcanoRaw(raw, i))
    .sort((a, b) => {
      const ta = a.announcedAt ? Date.parse(a.announcedAt) : a.eruptedAt ? Date.parse(a.eruptedAt) : 0;
      const tb = b.announcedAt ? Date.parse(b.announcedAt) : b.eruptedAt ? Date.parse(b.eruptedAt) : 0;
      return tb - ta;
    });

  return {
    ok: true,
    data,
    fetchedAt: new Date().toISOString(),
    source: "kma-apihub-volc",
  };
}
