const { env, fetchShelterRegionStats } = require("../_lib/shelter.js");

/** GET /api/shelter/region — Vercel Node (CommonJS) */
module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");

  const serviceKey = env("DATA_GO_KR_SERVICE_KEY") || env("VITE_DATA_GO_KR_SERVICE_KEY");
  if (!serviceKey) {
    res.status(503).json({
      ok: false,
      data: [],
      summary: {
        year: null,
        totalTargetPopulation: 0,
        totalShelterablePopulation: 0,
        totalGovSheltersCount: 0,
        totalPubSheltersCount: 0,
        totalGovSheltersArea: 0,
        totalPubSheltersArea: 0,
        averageAcceptanceRate: null,
      },
      fetchedAt: new Date().toISOString(),
      source: "data-go-kr-air-raid-shelter-region",
      error: "DATA_GO_KR_SERVICE_KEY 가 없습니다. Vercel 환경변수에 설정하세요.",
    });
    return;
  }

  try {
    const payload = await fetchShelterRegionStats(serviceKey, {
      basYy: req.query.bas_yy || req.query.basYy || "2019",
      pageNo: req.query.pageNo || "1",
      numOfRows: req.query.numOfRows || "100",
      type: req.query.type || "json",
    });
    res.status(payload.ok ? 200 : 502).json(payload);
  } catch (err) {
    res.status(502).json({
      ok: false,
      data: [],
      summary: {
        year: null,
        totalTargetPopulation: 0,
        totalShelterablePopulation: 0,
        totalGovSheltersCount: 0,
        totalPubSheltersCount: 0,
        totalGovSheltersArea: 0,
        totalPubSheltersArea: 0,
        averageAcceptanceRate: null,
      },
      fetchedAt: new Date().toISOString(),
      source: "data-go-kr-air-raid-shelter-region",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
