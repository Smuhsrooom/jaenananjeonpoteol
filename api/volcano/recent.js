const { env, fetchVolcanoes } = require("../_lib/kma.js");

/** GET /api/volcano/recent — Vercel Node (CommonJS) */
module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");

  const apiHubKey = env("KMA_APIHUB_AUTH_KEY") || env("VITE_KMA_APIHUB_AUTH_KEY");
  if (!apiHubKey) {
    res.status(503).json({
      ok: false,
      data: [],
      fetchedAt: new Date().toISOString(),
      source: "kma-apihub-volc",
      error: "KMA_APIHUB_AUTH_KEY 가 없습니다. Vercel 환경변수에 설정하세요.",
    });
    return;
  }

  try {
    const payload = await fetchVolcanoes(apiHubKey);
    res.status(payload.ok ? 200 : payload.needsApplication ? 403 : 502).json(payload);
  } catch (err) {
    res.status(502).json({
      ok: false,
      data: [],
      fetchedAt: new Date().toISOString(),
      source: "kma-apihub-volc",
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
