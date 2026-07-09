/** 기상청 지진정보 조회서비스 (공공데이터포털 EqkInfoService) 타입·매핑 */

export interface EarthquakeEvent {
  seq: string;
  type: "domestic" | "international";
  typeLabel: string;
  magnitude: number;
  lat: number;
  lon: number;
  location: string;
  intensity: string | null;
  remark: string | null;
  announcedAt: string | null;
  occurredAt: string | null;
  depthKm: number | null;
  mapImage: string | null;
}

export type EarthquakeSource = "kma-apihub" | "kma-eqk-info" | "kma-weather-web";

export interface EarthquakeApiResponse {
  ok: boolean;
  data: EarthquakeEvent[];
  fetchedAt: string;
  source: EarthquakeSource;
  error?: string;
  warning?: string;
}

/** API허브 eqk_now.php TP 코드 */
const APIHUB_TP_LABEL: Record<string, string> = {
  "2": "국외지진정보",
  "3": "국내지진통보",
  "5": "국내지진(재통보)",
  "10": "국외지진속보",
  "11": "국내지진속보",
  "14": "지진조기경보",
};

/** KMA getEqkMsg item (필드명 그대로) */
export interface KmaEqkItem {
  stnId?: string | number;
  fcTp?: string | number;
  img?: string;
  tmFc?: string | number;
  tmSeq?: string | number;
  cnt?: string | number;
  tmEqk?: string | number;
  tmMsc?: string | number;
  lat?: string | number;
  lon?: string | number;
  loc?: string;
  mt?: string | number;
  inT?: string;
  dep?: string | number;
  rem?: string;
  cor?: string;
}

const FC_TP_LABEL: Record<string, string> = {
  "2": "지진정보",
  "3": "국외지진정보",
  "4": "지진속보",
  "5": "지진해일정보",
  "11": "국내지진정보",
  "12": "국외지진정보",
  "13": "지진해일정보",
  "14": "국내지진속보",
};

function asArray<T>(value: T | T[] | null | undefined): T[] {
  if (value == null) return [];
  return Array.isArray(value) ? value : [value];
}

/** yyyyMMdd[HHmm[ss]] → ISO (KST 가정, +09:00) */
export function parseKmaDateTime(raw: string | number | null | undefined): string | null {
  if (raw == null || raw === "") return null;
  const s = String(raw).replace(/\D/g, "");
  if (s.length < 8) return null;

  const y = s.slice(0, 4);
  const mo = s.slice(4, 6);
  const d = s.slice(6, 8);
  const h = s.slice(8, 10) || "00";
  const mi = s.slice(10, 12) || "00";
  const se = s.slice(12, 14) || "00";

  const iso = `${y}-${mo}-${d}T${h}:${mi}:${se}+09:00`;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : new Date(t).toISOString();
}

/**
 * 조회 기간 (fromTmFc ~ toTmFc)
 * 기상청 EqkInfoService 제약: 최대 조회 기간은 오늘 기준 3일 전까지 (resultCode 99)
 */
export const KMA_EQK_MAX_LOOKBACK_DAYS = 3;

export function defaultDateRange(days = KMA_EQK_MAX_LOOKBACK_DAYS): {
  fromTmFc: string;
  toTmFc: string;
} {
  const lookback = Math.min(Math.max(days, 0), KMA_EQK_MAX_LOOKBACK_DAYS);
  // Asia/Seoul 기준 날짜로 맞춤 (서버 UTC여도 한국 달력 기준)
  const nowKst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const to = new Date(nowKst);
  const from = new Date(nowKst);
  from.setUTCDate(from.getUTCDate() - lookback);
  return {
    fromTmFc: yyyymmddUtcParts(from),
    toTmFc: yyyymmddUtcParts(to),
  };
}

function yyyymmddUtcParts(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function resolveType(fcTp: string | number | undefined, loc: string): {
  type: "domestic" | "international";
  typeLabel: string;
} {
  const code = String(fcTp ?? "").trim();
  const label = FC_TP_LABEL[code] ?? (code ? `통보종류 ${code}` : "지진정보");
  // 국내 행정구역 키워드가 있으면 국내로 우선 분류
  const isDomesticLoc =
    /서울|부산|대구|인천|광주|대전|울산|세종|경기|강원|충북|충남|전북|전남|경북|경남|제주|북한|해역|시 |군 |구 /.test(
      loc,
    );
  const isIntl =
    !isDomesticLoc &&
    (code === "3" ||
      code === "12" ||
      label.includes("국외") ||
      /일본|중국|대만|필리핀|인도네시아|러시아|해외|태평양|미얀마|인도/.test(loc));
  return {
    type: isIntl ? "international" : "domestic",
    typeLabel: isDomesticLoc && label.includes("국외") ? "지진정보" : label,
  };
}

export function mapKmaItem(item: KmaEqkItem): EarthquakeEvent {
  const location = String(item.loc ?? "위치 정보 없음").trim();
  const { type, typeLabel } = resolveType(item.fcTp, location);
  const magnitude = Number(item.mt);
  const lat = Number(item.lat);
  const lon = Number(item.lon);
  const depth = item.dep != null && item.dep !== "" ? Number(item.dep) : null;

  return {
    seq: String(item.tmSeq ?? item.cnt ?? item.tmEqk ?? `${item.lat}-${item.lon}-${item.tmFc}`),
    type,
    typeLabel,
    magnitude: Number.isFinite(magnitude) ? magnitude : 0,
    lat: Number.isFinite(lat) ? lat : 0,
    lon: Number.isFinite(lon) ? lon : 0,
    location,
    intensity: item.inT ? String(item.inT).trim() : null,
    remark: item.rem ? String(item.rem).trim() : null,
    announcedAt: parseKmaDateTime(item.tmFc),
    occurredAt: parseKmaDateTime(item.tmEqk),
    depthKm: depth != null && Number.isFinite(depth) ? depth : null,
    mapImage: item.img ? String(item.img).trim() : null,
  };
}

export function extractKmaItems(payload: unknown): KmaEqkItem[] {
  const root = payload as {
    response?: {
      header?: { resultCode?: string; resultMsg?: string };
      body?: {
        items?: { item?: KmaEqkItem | KmaEqkItem[] } | string;
        totalCount?: number | string;
      };
    };
  };

  const header = root?.response?.header;
  if (header?.resultCode && header.resultCode !== "00") {
    throw new Error(`기상청 API 오류: ${header.resultMsg ?? header.resultCode}`);
  }

  const items = root?.response?.body?.items;
  if (items == null || items === "") return [];
  if (typeof items === "string") return [];

  return asArray(items.item);
}

export function buildKmaEqkUrl(serviceKey: string, options?: {
  pageNo?: number;
  numOfRows?: number;
  fromTmFc?: string;
  toTmFc?: string;
}): string {
  const { fromTmFc, toTmFc } = defaultDateRange(KMA_EQK_MAX_LOOKBACK_DAYS);
  const params = new URLSearchParams({
    serviceKey: serviceKey, // 일부 게이트웨이는 serviceKey
    ServiceKey: serviceKey, // 공식 문서 파라미터명
    pageNo: String(options?.pageNo ?? 1),
    numOfRows: String(options?.numOfRows ?? 20),
    dataType: "JSON",
    fromTmFc: options?.fromTmFc ?? fromTmFc,
    toTmFc: options?.toTmFc ?? toTmFc,
  });

  // ServiceKey는 이미 인코딩된 키가 올 수 있어 URLSearchParams 이중 인코딩 이슈가 있음.
  // 공식 관례: 디코딩된 키를 쓰고, 필요 시 원문 유지.
  const base = "https://apis.data.go.kr/1360000/EqkInfoService/getEqkMsg";
  return `${base}?${params.toString()}`;
}

/**
 * ServiceKey가 이미 percent-encoding 된 경우(예: %2B, %3D) 이중 인코딩을 피하기 위해
 * 쿼리를 수동으로 조립합니다.
 */
export function buildKmaEqkUrlRaw(serviceKey: string, options?: {
  pageNo?: number;
  numOfRows?: number;
  fromTmFc?: string;
  toTmFc?: string;
}): string {
  const range = defaultDateRange(KMA_EQK_MAX_LOOKBACK_DAYS);
  const fromTmFc = options?.fromTmFc ?? range.fromTmFc;
  const toTmFc = options?.toTmFc ?? range.toTmFc;
  const pageNo = options?.pageNo ?? 1;
  const numOfRows = options?.numOfRows ?? 20;

  const keyLooksEncoded = /%[0-9A-Fa-f]{2}/.test(serviceKey);
  const keyParam = keyLooksEncoded ? serviceKey : encodeURIComponent(serviceKey);

  return (
    "https://apis.data.go.kr/1360000/EqkInfoService/getEqkMsg" +
    `?ServiceKey=${keyParam}` +
    `&pageNo=${pageNo}` +
    `&numOfRows=${numOfRows}` +
    `&dataType=JSON` +
    `&fromTmFc=${fromTmFc}` +
    `&toTmFc=${toTmFc}`
  );
}

function sortByOccurredDesc(data: EarthquakeEvent[]): EarthquakeEvent[] {
  return [...data].sort((a, b) => {
    const ta = a.occurredAt ? Date.parse(a.occurredAt) : 0;
    const tb = b.occurredAt ? Date.parse(b.occurredAt) : 0;
    return tb - ta;
  });
}

/**
 * 기상청 날씨누리 국내지진조회 페이지(공개 HTML) 파싱.
 * data.go.kr 키가 403 등으로 막힐 때 동일 출처(기상청) 데이터를 쓰기 위한 폴백.
 */
export async function fetchKmaEarthquakesFromWeb(): Promise<EarthquakeApiResponse> {
  const url = "https://www.weather.go.kr/w/earthquake-volcano/search/korea.do";
  const res = await fetch(url, {
    headers: {
      Accept: "text/html,application/xhtml+xml",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "ko-KR,ko;q=0.9",
    },
  });
  if (!res.ok) throw new Error(`기상청 날씨누리 HTTP ${res.status}`);

  const html = await res.text();
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  const data: EarthquakeEvent[] = [];

  for (const row of rows) {
    const tds = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((x) =>
      x[1]
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim(),
    );
    // [번호, 발생시각, 규모, 깊이, 최대진도, 위도, 경도, 위치, 지도, 상세]
    if (tds.length < 8) continue;
    const occurredRaw = tds[1];
    const mag = Number(tds[2]);
    const depth = Number(tds[3]);
    const intensity = tds[4] || null;
    const lat = Number(String(tds[5]).replace(/[^\d.-]/g, ""));
    const lon = Number(String(tds[6]).replace(/[^\d.-]/g, ""));
    const location = tds[7];
    if (!occurredRaw || !Number.isFinite(mag) || !location) continue;
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue;

    // 2026/07/06 20:57:24 → ISO
    const m = occurredRaw.match(
      /(\d{4})[./-](\d{2})[./-](\d{2})\s+(\d{2}):(\d{2})(?::(\d{2}))?/,
    );
    let occurredAt: string | null = null;
    if (m) {
      occurredAt = new Date(
        `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6] ?? "00"}+09:00`,
      ).toISOString();
    }

    data.push({
      seq: tds[0] || `${occurredRaw}-${lat}-${lon}`,
      type: /북한|일본|중국|대만|해외/.test(location) ? "international" : "domestic",
      typeLabel: "국내지진",
      magnitude: mag,
      lat,
      lon,
      location,
      intensity,
      remark: Number.isFinite(depth) ? `깊이 ${depth}km` : null,
      announcedAt: occurredAt,
      occurredAt,
      depthKm: Number.isFinite(depth) ? depth : null,
      mapImage: null,
    });
  }

  if (data.length === 0) {
    throw new Error("기상청 날씨누리에서 지진 목록을 파싱하지 못했습니다.");
  }

  return {
    ok: true,
    data: sortByOccurredDesc(data),
    fetchedAt: new Date().toISOString(),
    source: "kma-weather-web",
  };
}

export async function fetchKmaEarthquakesFromOpenApi(
  serviceKey: string,
): Promise<EarthquakeApiResponse> {
  // 제약: 오늘 기준 최대 3일 전까지만 조회 가능 (resultCode 99)
  const url = buildKmaEqkUrlRaw(serviceKey, {
    pageNo: 1,
    numOfRows: 20,
    ...defaultDateRange(KMA_EQK_MAX_LOOKBACK_DAYS),
  });

  const res = await fetch(url, {
    headers: {
      Accept: "application/json, text/xml, */*",
      "User-Agent": "disaster-safety-portal/1.0 (data.go.kr EqkInfoService)",
    },
  });

  const text = await res.text();

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error(
        "data.go.kr 403 Forbidden — 키는 인식되지만 호출이 거절됨. Encoding 키 사용 또는 브라우저 미리보기 확인 필요.",
      );
    }
    if (res.status === 401) {
      throw new Error("data.go.kr 401 Unauthorized — 인증키 오류");
    }
    const snippet = text.slice(0, 160).replace(/\s+/g, " ");
    throw new Error(`data.go.kr HTTP ${res.status}: ${snippet || res.statusText}`);
  }

  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    if (text.includes("<") && text.includes("resultCode")) {
      const code = text.match(/<resultCode>([^<]+)<\/resultCode>/)?.[1];
      const msg = text.match(/<resultMsg>([^<]+)<\/resultMsg>/)?.[1];
      if (code && code !== "00") {
        throw new Error(`data.go.kr API 오류: ${msg ?? code}`);
      }
    }
    // XML 성공 응답 간단 파싱
    if (text.includes("<item>")) {
      const itemBlocks = [...text.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => m[1]);
      const items: KmaEqkItem[] = itemBlocks.map((block) => {
        const pick = (tag: string) =>
          block.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, "i"))?.[1]?.trim();
        return {
          fcTp: pick("fcTp"),
          tmFc: pick("tmFc"),
          tmSeq: pick("tmSeq"),
          tmEqk: pick("tmEqk"),
          lat: pick("lat"),
          lon: pick("lon"),
          loc: pick("loc"),
          mt: pick("mt"),
          inT: pick("inT"),
          dep: pick("dep"),
          rem: pick("rem"),
          img: pick("img"),
        };
      });
      return {
        ok: true,
        data: sortByOccurredDesc(items.map(mapKmaItem)),
        fetchedAt: new Date().toISOString(),
        source: "kma-eqk-info",
      };
    }
    const snippet = text.slice(0, 200).replace(/\s+/g, " ");
    throw new Error(`data.go.kr 응답 파싱 실패: ${snippet}`);
  }

  const items = extractKmaItems(json);
  return {
    ok: true,
    data: sortByOccurredDesc(items.map(mapKmaItem)),
    fetchedAt: new Date().toISOString(),
    source: "kma-eqk-info",
  };
}

/**
 * 기상청 API허브 — 최근 지진정보 (eqk_now.php)
 * 응답: EUC-KR 텍스트 CSV (disp=1)
 * https://apihub.kma.go.kr/api/typ01/url/eqk_now.php?disp=1&authKey=...
 */
export async function fetchKmaEarthquakesFromApiHub(
  authKey: string,
): Promise<EarthquakeApiResponse> {
  const keyParam = encodeURIComponent(authKey.trim());
  // tm 생략 시 최근 자료 (문서: 없으면 최근 10일 이내)
  const url = `https://apihub.kma.go.kr/api/typ01/url/eqk_now.php?disp=1&authKey=${keyParam}`;

  const res = await fetch(url, {
    headers: {
      Accept: "text/plain, */*",
      "User-Agent": "disaster-safety-portal/1.0 (apihub eqk_now)",
    },
  });

  const bytes = new Uint8Array(await res.arrayBuffer());
  let text: string;
  try {
    text = new TextDecoder("euc-kr").decode(bytes);
  } catch {
    text = new TextDecoder("utf-8").decode(bytes);
  }

  if (!res.ok) {
    const snip = text.slice(0, 120).replace(/\s+/g, " ");
    throw new Error(`API허브 HTTP ${res.status}: ${snip || res.statusText}`);
  }

  // JSON 에러 응답
  if (text.trimStart().startsWith("{")) {
    try {
      const j = JSON.parse(text) as { result?: { status?: number; message?: string } };
      throw new Error(
        `API허브 오류 ${j.result?.status ?? ""}: ${j.result?.message ?? text.slice(0, 80)}`,
      );
    } catch (e) {
      if (e instanceof Error && e.message.startsWith("API허브")) throw e;
      throw new Error(`API허브 응답 오류: ${text.slice(0, 120)}`);
    }
  }

  if (text.includes("인증키") && text.includes("유효")) {
    throw new Error("API허브 인증키 오류 — KMA_APIHUB_AUTH_KEY 를 확인하세요.");
  }

  const data = parseApiHubEqkCsv(text);
  if (data.length === 0) {
    throw new Error("API허브 eqk_now 응답에서 지진 행을 파싱하지 못했습니다.");
  }

  return {
    ok: true,
    data: sortByOccurredDesc(data),
    fetchedAt: new Date().toISOString(),
    source: "kma-apihub",
  };
}

/** disp=1 CSV 라인 파싱 */
export function parseApiHubEqkCsv(text: string): EarthquakeEvent[] {
  const lines = text.split(/\r?\n/);
  const out: EarthquakeEvent[] = [];

  for (const raw of lines) {
    const line = raw.trim();
    if (!line || line.startsWith("#") || line.startsWith("#START")) continue;

    // TP,TM_FC,SEQ,TM_EQK.MSC,MT,LAT,LON,LOC,INT,REM,COR,=
    const cleaned = line.replace(/,=\s*$/, "").replace(/=\s*$/, "");
    const m = cleaned.match(
      /^\s*(\d+),(\d+),(\d+),([\d.]+),([-\d.]+),([-\d.]+),([-\d.]+),(.*)$/,
    );
    if (!m) continue;

    const [, tp, tmFc, seq, tmEqkMsc, mt, lat, lon, rest] = m;
    // rest = LOC,INT,REM,COR  (INT 안에 쉼표 가능: 최대진도 Ⅲ(경북),Ⅱ(충북))
    const lastComma = rest.lastIndexOf(",");
    const cor = lastComma >= 0 ? rest.slice(lastComma + 1).trim() : "";
    const mid = lastComma >= 0 ? rest.slice(0, lastComma) : rest;

    const firstComma = mid.indexOf(",");
    let location: string;
    let intRem: string;
    if (firstComma < 0) {
      location = mid.trim();
      intRem = "";
    } else {
      location = mid.slice(0, firstComma).trim();
      intRem = mid.slice(firstComma + 1);
    }

    let intensity: string | null = null;
    let remark: string | null = null;
    if (intRem.startsWith("최대진도")) {
      const mInt = intRem.match(
        /^(최대진도(?:[^,]|,(?=\s*[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩIVXivx\d(]))*)(?:,(.*))?$/u,
      );
      intensity = (mInt?.[1] ?? intRem).trim() || null;
      remark = mInt?.[2]?.trim() || null;
    } else if (intRem) {
      const c = intRem.indexOf(",");
      if (c < 0) {
        // intensity empty then remark, or single field
        if (intRem.trim() === "") {
          remark = null;
        } else {
          intensity = intRem.trim();
        }
      } else if (intRem.startsWith(",")) {
        remark = intRem.slice(1).trim() || null;
      } else {
        intensity = intRem.slice(0, c).trim() || null;
        remark = intRem.slice(c + 1).trim() || null;
      }
    }
    if (cor && cor !== "없음" && remark) {
      remark = `${remark} (수정: ${cor})`;
    }

    const tmEqk = String(tmEqkMsc).split(".")[0]; // 20260706205724.000 → 20260706205724
    const typeLabel = APIHUB_TP_LABEL[tp] ?? `통보 ${tp}`;
    const isIntl = tp === "2" || tp === "10" || typeLabel.includes("국외");

    out.push({
      seq: String(seq),
      type: isIntl ? "international" : "domestic",
      typeLabel,
      magnitude: Number(mt) || 0,
      lat: Number(lat) || 0,
      lon: Number(lon) || 0,
      location: location || "위치 정보 없음",
      intensity,
      remark,
      announcedAt: parseKmaDateTime(tmFc),
      occurredAt: parseKmaDateTime(tmEqk),
      depthKm: null,
      mapImage: null,
    });
  }

  return out;
}

export interface FetchEarthquakeOptions {
  /** 기상청 API허브 authKey */
  apiHubKey?: string;
  /** 공공데이터포털 ServiceKey */
  dataGoKrKey?: string;
}

/**
 * 우선순위:
 * 1) 기상청 API허브 eqk_now
 * 2) data.go.kr EqkInfoService
 * 3) weather.go.kr 공개 페이지
 */
export async function fetchKmaEarthquakes(
  options?: string | FetchEarthquakeOptions,
): Promise<EarthquakeApiResponse> {
  // 하위 호환: 예전엔 serviceKey 문자열만 받음
  const opts: FetchEarthquakeOptions =
    typeof options === "string" ? { dataGoKrKey: options } : (options ?? {});

  const errors: string[] = [];

  if (opts.apiHubKey?.trim()) {
    try {
      return await fetchKmaEarthquakesFromApiHub(opts.apiHubKey.trim());
    } catch (e) {
      errors.push(`API허브: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  if (opts.dataGoKrKey?.trim()) {
    try {
      return await fetchKmaEarthquakesFromOpenApi(opts.dataGoKrKey.trim());
    } catch (e) {
      errors.push(`data.go.kr: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  try {
    const web = await fetchKmaEarthquakesFromWeb();
    return {
      ...web,
      warning:
        errors.length > 0
          ? `${errors.join(" | ")} → 날씨누리 공개 페이지 사용`
          : undefined,
    };
  } catch (e) {
    const webErr = e instanceof Error ? e.message : String(e);
    throw new Error([...errors, webErr].join(" / "));
  }
}
