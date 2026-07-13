import type { Plugin, Connect } from "vite";
import { createRequire } from "node:module";
import {
  fetchKmaEarthquakes,
  type EarthquakeApiResponse,
} from "./src/lib/kmaEarthquake";
import {
  fetchVolcanoInfoFromApiHub,
  type VolcanoApiResponse,
} from "./src/lib/kmaVolcano";

const require = createRequire(import.meta.url);
const { fetchShelterRegionStats } = require("../../api/_lib/shelter.js") as {
  fetchShelterRegionStats: (
    serviceKey: string,
    options?: {
      basYy?: string;
      pageNo?: string;
      numOfRows?: string;
      type?: string;
    },
  ) => Promise<{
    ok: boolean;
    data: unknown[];
    summary: unknown;
    fetchedAt: string;
    source: string;
    error?: string;
  }>;
};

function readApiHubKey() {
  return (
    process.env.KMA_APIHUB_AUTH_KEY?.trim() ||
    process.env.VITE_KMA_APIHUB_AUTH_KEY?.trim() ||
    ""
  );
}

function readDataGoKrKey() {
  return (
    process.env.DATA_GO_KR_SERVICE_KEY?.trim() ||
    process.env.VITE_DATA_GO_KR_SERVICE_KEY?.trim() ||
    ""
  );
}

/**
 * GET /api/earthquake/recent
 *   1) API허브 eqk_now  2) data.go.kr  3) weather.go.kr
 *
 * GET /api/volcano/recent
 *   API허브 selectVolcInfoList.do
 *
 * GET /api/shelter/region
 *   data.go.kr AirRaidShelterRegion/getAirRaidShelterRegionList
 */
export function kmaPublicApiPlugin(): Plugin {
  const handler: Connect.NextHandleFunction = async (req, res, next) => {
    const url = req.url ?? "";
    const parsed = new URL(url, "http://localhost");
    const isEqk = url.startsWith("/api/earthquake/recent");
    const isVolc = url.startsWith("/api/volcano/recent");
    const isShelter = url.startsWith("/api/shelter/region");
    if (!isEqk && !isVolc && !isShelter) {
      next();
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      res.statusCode = 405;
      res.setHeader("Content-Type", "application/json; charset=utf-8");
      res.end(JSON.stringify({ ok: false, error: "Method Not Allowed" }));
      return;
    }

    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Cache-Control", "no-store");

    try {
      if (isShelter) {
        const serviceKey =
          process.env.DATA_GO_KR_SERVICE_KEY?.trim() ||
          process.env.VITE_DATA_GO_KR_SERVICE_KEY?.trim() ||
          "";
        if (!serviceKey) {
          res.statusCode = 503;
          res.end(
            JSON.stringify({
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
              error: "DATA_GO_KR_SERVICE_KEY 가 없습니다.",
            }),
          );
          return;
        }

        const payload = await fetchShelterRegionStats(serviceKey, {
          basYy: parsed.searchParams.get("bas_yy") || parsed.searchParams.get("basYy") || "2019",
          pageNo: parsed.searchParams.get("pageNo") || "1",
          numOfRows: parsed.searchParams.get("numOfRows") || "100",
          type: parsed.searchParams.get("type") || "json",
        });
        res.statusCode = payload.ok ? 200 : 502;
        res.end(JSON.stringify(payload));
        return;
      }

      if (isVolc) {
        const apiHubKey = readApiHubKey();
        if (!apiHubKey) {
          res.statusCode = 503;
          const body: VolcanoApiResponse = {
            ok: false,
            data: [],
            fetchedAt: new Date().toISOString(),
            source: "kma-apihub-volc",
            error: "KMA_APIHUB_AUTH_KEY 가 없습니다.",
          };
          res.end(JSON.stringify(body));
          return;
        }
        const payload = await fetchVolcanoInfoFromApiHub(apiHubKey);
        // 활용신청 필요(403)도 JSON으로 200 계열 대신 명확히 전달
        res.statusCode = payload.ok ? 200 : payload.needsApplication ? 403 : 502;
        res.end(JSON.stringify(payload));
        return;
      }

      const payload = await fetchKmaEarthquakes({
        apiHubKey: readApiHubKey() || undefined,
        dataGoKrKey: readDataGoKrKey() || undefined,
      });
      res.statusCode = 200;
      res.end(JSON.stringify(payload));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.statusCode = 502;
      if (isVolc) {
        const body: VolcanoApiResponse = {
          ok: false,
          data: [],
          fetchedAt: new Date().toISOString(),
          source: "kma-apihub-volc",
          error: message,
        };
        res.end(JSON.stringify(body));
        return;
      }
      const body: EarthquakeApiResponse = {
        ok: false,
        data: [],
        fetchedAt: new Date().toISOString(),
        source: "kma-apihub",
        error: message,
      };
      res.end(JSON.stringify(body));
    }
  };

  return {
    name: "kma-public-api",
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    },
  };
}
