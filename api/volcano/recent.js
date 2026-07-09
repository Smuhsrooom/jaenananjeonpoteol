import { fetchVolcanoInfoFromApiHub } from "../../artifacts/disaster-safety-portal/src/lib/kmaVolcano.ts";

function env(name) {
  return (typeof process !== "undefined" && process.env?.[name]?.trim()) || "";
}

/**
 * Vercel Serverless — GET /api/volcano/recent
 */
export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  const apiHubKey = env("KMA_APIHUB_AUTH_KEY") || env("VITE_KMA_APIHUB_AUTH_KEY");

  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=120");

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
    const payload = await fetchVolcanoInfoFromApiHub(apiHubKey);
    res.status(payload.ok ? 200 : payload.needsApplication ? 403 : 502).json(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(502).json({
      ok: false,
      data: [],
      fetchedAt: new Date().toISOString(),
      source: "kma-apihub-volc",
      error: message,
    });
  }
}
