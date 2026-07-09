import { env, fetchEarthquakes } from "../_lib/kma.mjs";

export default async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.status(405).json({ ok: false, error: "Method Not Allowed" });
    return;
  }

  res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");

  try {
    const payload = await fetchEarthquakes({
      apiHubKey: env("KMA_APIHUB_AUTH_KEY") || env("VITE_KMA_APIHUB_AUTH_KEY") || undefined,
      dataGoKrKey: env("DATA_GO_KR_SERVICE_KEY") || env("VITE_DATA_GO_KR_SERVICE_KEY") || undefined,
    });
    res.status(200).json(payload);
  } catch (err) {
    res.status(502).json({
      ok: false,
      data: [],
      fetchedAt: new Date().toISOString(),
      source: "kma-apihub",
      error: err instanceof Error ? err.message : String(err),
    });
  }
}
