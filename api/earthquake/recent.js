import { fetchKmaEarthquakes } from "../../artifacts/disaster-safety-portal/src/lib/kmaEarthquake.ts";

function env(name) {
  return (typeof process !== "undefined" && process.env?.[name]?.trim()) || "";
}

/**
 * Vercel Serverless — GET /api/earthquake/recent
 */
export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  const apiHubKey = env("KMA_APIHUB_AUTH_KEY") || env("VITE_KMA_APIHUB_AUTH_KEY");
  const dataGoKrKey = env("DATA_GO_KR_SERVICE_KEY") || env("VITE_DATA_GO_KR_SERVICE_KEY");

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
