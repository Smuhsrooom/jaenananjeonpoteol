function env(name) {
  try {
    return (process.env[name] || "").trim();
  } catch {
    return "";
  }
}

function parseNumber(value) {
  if (value == null || value === "") return null;
  const n = Number(String(value).replace(/,/g, "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : null;
}

function parseXmlTagMap(block) {
  const raw = {};
  const tags = [...block.matchAll(/<([A-Za-z_][\w.-]*)(?:\s[^>]*)?>([\s\S]*?)<\/\1>/g)];
  for (const t of tags) {
    const val = t[2]
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
      .replace(/<[^>]+>/g, "")
      .trim();
    if (val && val !== "-") raw[t[1]] = val;
  }
  return raw;
}

function parseXmlItems(xml) {
  const items = [];
  for (const match of xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi)) {
    const raw = parseXmlTagMap(match[1]);
    if (Object.keys(raw).length) items.push(raw);
  }
  if (!items.length) {
    const bodyMatch = xml.match(/<body(?:\s[^>]*)?>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      const raw = parseXmlTagMap(bodyMatch[1]);
      if (Object.keys(raw).length) items.push(raw);
    }
  }
  return items;
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value == null) return [];
  return [value];
}

function pickFirst(obj, keys) {
  for (const key of keys) {
    if (obj[key] != null && obj[key] !== "") return obj[key];
  }
  return null;
}

function normalizeRegionRow(raw) {
  const region = pickFirst(raw, ["regi", "region", "sido", "sidoNm", "ctprvnNm", "ctprvn", "sigungu", "sgg", "areaNm"]);
  const year = parseNumber(pickFirst(raw, ["bas_yy", "year", "yy"]));
  const targetPopulation = parseNumber(pickFirst(raw, ["target_popl", "targetPopl", "target_population"]));
  const acceptanceRate = parseNumber(pickFirst(raw, ["accpt_rt", "acceptanceRate", "accptRate"]));
  const shelterablePopulation = parseNumber(
    pickFirst(raw, ["shelt_abl_popl_smry", "shelterablePopulation", "shelter_popl"]),
  );
  const govShelterablePopulation = parseNumber(
    pickFirst(raw, ["shelt_abl_popl_gov_shelts", "govShelterablePopulation"]),
  );
  const pubShelterablePopulation = parseNumber(
    pickFirst(raw, ["shelt_abl_popl_pub_shelts", "pubShelterablePopulation"]),
  );
  const govSheltersCount = parseNumber(pickFirst(raw, ["gov_shelts_shelts", "govSheltersCount"]));
  const govSheltersArea = parseNumber(pickFirst(raw, ["gov_shelts_area", "govSheltersArea"]));
  const pubSheltersCount = parseNumber(pickFirst(raw, ["pub_shelts_shelts", "pubSheltersCount"]));
  const pubSheltersArea = parseNumber(pickFirst(raw, ["pub_shelts_area", "pubSheltersArea"]));
  const dataType = pickFirst(raw, ["type", "dataType"]);

  return {
    year,
    region: region ? String(region) : "지역 정보 없음",
    targetPopulation,
    acceptanceRate,
    shelterablePopulation,
    govShelterablePopulation,
    pubShelterablePopulation,
    govSheltersCount,
    govSheltersArea,
    pubSheltersCount,
    pubSheltersArea,
    dataType: dataType ? String(dataType) : null,
    raw,
  };
}

function computeSummary(data) {
  const summary = {
    year: null,
    totalTargetPopulation: 0,
    totalShelterablePopulation: 0,
    totalGovSheltersCount: 0,
    totalPubSheltersCount: 0,
    totalGovSheltersArea: 0,
    totalPubSheltersArea: 0,
    averageAcceptanceRate: null,
  };

  let rateSum = 0;
  let rateCount = 0;

  for (const row of data) {
    if (summary.year == null && row.year != null) summary.year = row.year;
    if (row.targetPopulation != null) summary.totalTargetPopulation += row.targetPopulation;
    if (row.shelterablePopulation != null) summary.totalShelterablePopulation += row.shelterablePopulation;
    if (row.govSheltersCount != null) summary.totalGovSheltersCount += row.govSheltersCount;
    if (row.pubSheltersCount != null) summary.totalPubSheltersCount += row.pubSheltersCount;
    if (row.govSheltersArea != null) summary.totalGovSheltersArea += row.govSheltersArea;
    if (row.pubSheltersArea != null) summary.totalPubSheltersArea += row.pubSheltersArea;
    if (row.acceptanceRate != null) {
      rateSum += row.acceptanceRate;
      rateCount += 1;
    }
  }

  if (rateCount > 0) {
    summary.averageAcceptanceRate = Math.round((rateSum / rateCount) * 10) / 10;
  }

  return summary;
}

async function fetchShelterRegionStats(serviceKey, options = {}) {
  const basYy = options.basYy || "2019";
  const pageNo = options.pageNo || "1";
  const numOfRows = options.numOfRows || "100";
  const type = options.type || "json";

  const keyLooksEncoded = /%[0-9A-Fa-f]{2}/.test(serviceKey);
  const keyParam = keyLooksEncoded ? serviceKey : encodeURIComponent(serviceKey);
  const url =
    "https://apis.data.go.kr/1741000/AirRaidShelterRegion/getAirRaidShelterRegionList" +
    `?ServiceKey=${keyParam}&pageNo=${encodeURIComponent(pageNo)}&numOfRows=${encodeURIComponent(numOfRows)}&type=${encodeURIComponent(type)}&bas_yy=${encodeURIComponent(basYy)}`;

  const res = await fetch(url, {
    headers: { Accept: "application/json, application/xml, text/xml, */*" },
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`data.go.kr HTTP ${res.status}`);

  let rawItems = [];
  let totalCount = null;
  let currentPage = null;
  let rows = null;
  let responseCode = null;
  let responseMessage = null;

  if (text.trimStart().startsWith("<")) {
    const items = parseXmlItems(text);
    rawItems = items;
    const headerMatch = text.match(/<resultCode>([\s\S]*?)<\/resultCode>/i);
    responseCode = headerMatch ? headerMatch[1].trim() : null;
    const msgMatch = text.match(/<resultMsg>([\s\S]*?)<\/resultMsg>/i);
    responseMessage = msgMatch ? msgMatch[1].trim() : null;
    const totalMatch = text.match(/<totalCount>([\s\S]*?)<\/totalCount>/i);
    totalCount = totalMatch ? parseNumber(totalMatch[1]) : null;
    const pageMatch = text.match(/<pageNo>([\s\S]*?)<\/pageNo>/i);
    currentPage = pageMatch ? parseNumber(pageMatch[1]) : null;
    const rowsMatch = text.match(/<numOfRows>([\s\S]*?)<\/numOfRows>/i);
    rows = rowsMatch ? parseNumber(rowsMatch[1]) : null;
  } else {
    const json = JSON.parse(text);
    responseCode = json?.response?.header?.resultCode ?? null;
    responseMessage = json?.response?.header?.resultMsg ?? null;
    totalCount = parseNumber(json?.response?.body?.totalCount);
    currentPage = parseNumber(json?.response?.body?.pageNo);
    rows = parseNumber(json?.response?.body?.numOfRows);
    const items = json?.response?.body?.items?.item ?? [];
    rawItems = toArray(items);
  }

  const normalized = rawItems.map(normalizeRegionRow);
  const data = normalized.sort((a, b) => {
    const ar = a.targetPopulation ?? 0;
    const br = b.targetPopulation ?? 0;
    return br - ar;
  });
  const summary = computeSummary(data);

  return {
    ok: responseCode ? responseCode === "00" || responseCode === "INFO-0" : true,
    data,
    summary,
    fetchedAt: new Date().toISOString(),
    source: "data-go-kr-air-raid-shelter-region",
    totalCount,
    pageNo: currentPage,
    numOfRows: rows,
    error: responseCode && responseCode !== "00" && responseCode !== "INFO-0" ? responseMessage : undefined,
  };
}

module.exports = {
  env,
  fetchShelterRegionStats,
  normalizeRegionRow,
};
