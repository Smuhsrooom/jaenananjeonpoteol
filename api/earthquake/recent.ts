import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchKmaEarthquakes } from "../../artifacts/disaster-safety-portal/src/lib/kmaEarthquake";

/**
 * Vercel Serverless — GET /api/earthquake/recent
 * 로컬 Vite 플러그인과 동일한 로직
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
  const dataGoKrKey =
    process.env.DATA_GO_KR_SERVICE_KEY?.trim() ||
    process.env.VITE_DATA_GO_KR_SERVICE_KEY?.trim() ||
    "";

  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");

  try {
    const payload = await fetchKmaEarthquakes({
      apiHubKey: apiHubKey || undefined,
      dataGoKrKey: dataGoKrKey || undefined,
    });
    res.status(200).json(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(502).json({
      ok: false,
      data: [],
      fetchedAt: new Date().toISOString(),
      source: "kma-apihub",
      error: message,
    });
  }
}
