/** 기상청 API 호출 (Vercel serverless용 순수 JS) */

function sortByOccurredDesc(data) {
  return [...data].sort((a, b) => {
    const ta = a.occurredAt ? Date.parse(a.occurredAt) : 0;
    const tb = b.occurredAt ? Date.parse(b.occurredAt) : 0;
    return tb - ta;
  });
}

function parseKmaDateTime(raw) {
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

function yyyymmddUtcParts(date) {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}`;
}

function defaultDateRange(days = 3) {
  const lookback = Math.min(Math.max(days, 0), 3);
  const nowKst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const to = new Date(nowKst);
  const from = new Date(nowKst);
  from.setUTCDate(from.getUTCDate() - lookback);
  return { fromTmFc: yyyymmddUtcParts(from), toTmFc: yyyymmddUtcParts(to) };
}

function parseApiHubEqkCsv(text) {
  const out = [];
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const cleaned = line.replace(/,=\s*$/, "").replace(/=\s*$/, "");
    const m = cleaned.match(
      /^\s*(\d+),(\d+),(\d+),([\d.]+),([-\d.]+),([-\d.]+),([-\d.]+),(.*)$/,
    );
    if (!m) continue;
    const [, tp, tmFc, seq, tmEqkMsc, mt, lat, lon, rest] = m;
    const lastComma = rest.lastIndexOf(",");
    const mid = lastComma >= 0 ? rest.slice(0, lastComma) : rest;
    const firstComma = mid.indexOf(",");
    const location = firstComma < 0 ? mid.trim() : mid.slice(0, firstComma).trim();
    let intRem = firstComma < 0 ? "" : mid.slice(firstComma + 1);
    let intensity = null;
    let remark = null;
    if (intRem.startsWith("최대진도")) {
      const mInt = intRem.match(
        /^(최대진도(?:[^,]|,(?=\s*[ⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩIVXivx\d(]))*)(?:,(.*))?$/u,
      );
      intensity = (mInt?.[1] ?? intRem).trim() || null;
      remark = mInt?.[2]?.trim() || null;
    } else if (intRem) {
      const c = intRem.indexOf(",");
      if (c < 0) intensity = intRem.trim() || null;
      else if (intRem.startsWith(",")) remark = intRem.slice(1).trim() || null;
      else {
        intensity = intRem.slice(0, c).trim() || null;
        remark = intRem.slice(c + 1).trim() || null;
      }
    }
    const labels = {
      2: "국외지진정보",
      3: "국내지진통보",
      5: "국내지진(재통보)",
      10: "국외지진속보",
      11: "국내지진속보",
      14: "지진조기경보",
    };
    const typeLabel = labels[tp] ?? `통보 ${tp}`;
    const isIntl = tp === "2" || tp === "10" || typeLabel.includes("국외");
    const tmEqk = String(tmEqkMsc).split(".")[0];
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

async function fetchFromApiHub(authKey) {
  const url = `https://apihub.kma.go.kr/api/typ01/url/eqk_now.php?disp=1&authKey=${encodeURIComponent(authKey)}`;
  const res = await fetch(url, {
    headers: { Accept: "text/plain, */*", "User-Agent": "disaster-safety-portal/1.0" },
  });
  const bytes = new Uint8Array(await res.arrayBuffer());
  let text;
  try {
    text = new TextDecoder("euc-kr").decode(bytes);
  } catch {
    text = new TextDecoder("utf-8").decode(bytes);
  }
  if (!res.ok) throw new Error(`API허브 HTTP ${res.status}`);
  if (text.trimStart().startsWith("{")) {
    const j = JSON.parse(text);
    throw new Error(`API허브 오류: ${j.result?.message ?? text.slice(0, 80)}`);
  }
  const data = parseApiHubEqkCsv(text);
  if (!data.length) throw new Error("지진 행 파싱 실패");
  return {
    ok: true,
    data: sortByOccurredDesc(data),
    fetchedAt: new Date().toISOString(),
    source: "kma-apihub",
  };
}

async function fetchFromDataGoKr(serviceKey) {
  const { fromTmFc, toTmFc } = defaultDateRange(3);
  const keyLooksEncoded = /%[0-9A-Fa-f]{2}/.test(serviceKey);
  const keyParam = keyLooksEncoded ? serviceKey : encodeURIComponent(serviceKey);
  const url =
    "https://apis.data.go.kr/1360000/EqkInfoService/getEqkMsg" +
    `?ServiceKey=${keyParam}&pageNo=1&numOfRows=20&dataType=JSON&fromTmFc=${fromTmFc}&toTmFc=${toTmFc}`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await res.text();
  if (!res.ok) throw new Error(`data.go.kr HTTP ${res.status}`);
  const json = JSON.parse(text);
  const code = json?.response?.header?.resultCode;
  if (code && code !== "00") {
    throw new Error(json?.response?.header?.resultMsg ?? code);
  }
  let items = json?.response?.body?.items?.item ?? [];
  if (!Array.isArray(items)) items = items ? [items] : [];
  const data = items.map((item) => ({
    seq: String(item.tmSeq ?? item.cnt ?? item.tmEqk ?? ""),
    type: String(item.fcTp) === "3" || String(item.fcTp) === "12" ? "international" : "domestic",
    typeLabel: "지진정보",
    magnitude: Number(item.mt) || 0,
    lat: Number(item.lat) || 0,
    lon: Number(item.lon) || 0,
    location: String(item.loc ?? "위치 정보 없음"),
    intensity: item.inT ? String(item.inT) : null,
    remark: item.rem ? String(item.rem) : null,
    announcedAt: parseKmaDateTime(item.tmFc),
    occurredAt: parseKmaDateTime(item.tmEqk),
    depthKm: item.dep != null && item.dep !== "" ? Number(item.dep) : null,
    mapImage: item.img ? String(item.img) : null,
  }));
  return {
    ok: true,
    data: sortByOccurredDesc(data),
    fetchedAt: new Date().toISOString(),
    source: "kma-eqk-info",
  };
}

export async function fetchEarthquakes({ apiHubKey, dataGoKrKey } = {}) {
  const errors = [];
  if (apiHubKey) {
    try {
      return await fetchFromApiHub(apiHubKey);
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e));
    }
  }
  if (dataGoKrKey) {
    try {
      return await fetchFromDataGoKr(dataGoKrKey);
    } catch (e) {
      errors.push(e instanceof Error ? e.message : String(e));
    }
  }
  throw new Error(errors.join(" / ") || "API 키 없음");
}

function extractTagMap(block) {
  const raw = {};
  const tags = [...block.matchAll(/<([A-Za-z_][\w.-]*)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g)];
  for (const t of tags) {
    if (/<[A-Za-z_]/.test(t[2]) && !t[2].includes("<!--")) {
      const withoutComments = t[2].replace(/<!--[\s\S]*?-->/g, "").trim();
      if (/<[A-Za-z_]/.test(withoutComments)) continue;
    }
    const val = t[2]
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .trim();
    if (val && val !== "-") raw[t[1]] = val;
  }
  return raw;
}

function parseXmlInfoItems(xml) {
  const items = [];
  for (const b of xml.matchAll(/<info(?:\s[^>]*)?>([\s\S]*?)<\/info>/gi)) {
    const raw = extractTagMap(b[1]);
    if (Object.keys(raw).length) items.push(raw);
  }
  return items;
}

function parseLooseDate(v) {
  if (!v) return null;
  const s = String(v).replace(/\D/g, "");
  if (s.length >= 8) {
    const iso = `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}T${s.slice(8, 10) || "00"}:${s.slice(10, 12) || "00"}:${s.slice(12, 14) || "00"}+09:00`;
    const t = Date.parse(iso);
    if (!Number.isNaN(t)) return new Date(t).toISOString();
  }
  const t = Date.parse(v);
  return Number.isNaN(t) ? v : new Date(t).toISOString();
}

function mapVolcanoRaw(raw, index) {
  const volcanoName = raw.volcName || raw.volcNm || null;
  const location = raw.volcLoc || raw.wrnLoc || raw.loc || null;
  const msgType = raw.msgCodeKo || raw.msgCode || null;
  const title =
    (volcanoName ? `${msgType ? `${msgType} · ` : ""}${volcanoName}` : null) ||
    msgType ||
    `화산정보 #${index + 1}`;
  const plumeRaw = raw.volcHtPlume || raw.plumeHgt || null;
  let plumeHeightKm = null;
  if (plumeRaw != null && plumeRaw !== "") {
    const n = Number(String(plumeRaw).replace(/[^\d.-]/g, ""));
    if (Number.isFinite(n)) plumeHeightKm = n >= 100 ? Math.round((n / 1000) * 10) / 10 : n;
  }
  const announcedAt = parseLooseDate(raw.tmIssue || raw.tmFc);
  const eruptedAt = parseLooseDate(raw.volcTm || raw.tmErpt);
  return {
    id: `${announcedAt ?? volcanoName ?? "volc"}-${index}`,
    title,
    volcanoName,
    location,
    announcedAt,
    eruptedAt,
    plumeHeightKm,
    lat: raw.volcLat != null ? Number(raw.volcLat) : null,
    lon: raw.volcLon != null ? Number(raw.volcLon) : null,
    alertLevel: msgType,
    message: raw.refer || raw.release || raw.rem || null,
    raw,
  };
}

export async function fetchVolcanoes(authKey) {
  const url = `https://apihub.kma.go.kr/api/typ09/url/volc/selectVolcInfoList.do?orderTy=xml&authKey=${encodeURIComponent(authKey)}`;
  const res = await fetch(url, {
    headers: { Accept: "application/xml, text/xml, */*", "User-Agent": "disaster-safety-portal/1.0" },
  });
  const bytes = new Uint8Array(await res.arrayBuffer());
  let text = new TextDecoder("utf-8").decode(bytes);
  if (!text.includes("<") && !/[\uAC00-\uD7A3]/.test(text)) {
    try {
      text = new TextDecoder("euc-kr").decode(bytes);
    } catch {
      /* keep utf8 */
    }
  }

  if (text.trimStart().startsWith("{")) {
    const j = JSON.parse(text);
    const status = j.result?.status ?? res.status;
    const message = j.result?.message ?? text;
    return {
      ok: false,
      data: [],
      fetchedAt: new Date().toISOString(),
      source: "kma-apihub-volc",
      error: `API허브 화산정보 ${status}: ${message}`,
      needsApplication: status === 403 || String(message).includes("활용신청"),
    };
  }
  if (!res.ok) throw new Error(`API허브 화산 HTTP ${res.status}`);

  const rawItems = parseXmlInfoItems(text);
  const data = rawItems
    .map((raw, i) => mapVolcanoRaw(raw, i))
    .sort((a, b) => {
      const ta = a.announcedAt ? Date.parse(a.announcedAt) : 0;
      const tb = b.announcedAt ? Date.parse(b.announcedAt) : 0;
      return tb - ta;
    });

  return {
    ok: true,
    data,
    fetchedAt: new Date().toISOString(),
    source: "kma-apihub-volc",
  };
}

export function env(name) {
  try {
    // eslint-disable-next-line no-undef
    return globalThis.process?.env?.[name]?.trim?.() || "";
  } catch {
    return "";
  }
}
