import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchVolcanoInfoFromApiHub } from "../../artifacts/disaster-safety-portal/src/lib/kmaVolcano";

/**
 * Vercel Serverless — GET /api/volcano/recent
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  const apiHubKey =
    process.env.KMA_APIHUB_AUTH_KEY?.trim() ||
    process.env.VITE_KMA_APIHUB_AUTH_KEY?.trim() ||
    "";

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
