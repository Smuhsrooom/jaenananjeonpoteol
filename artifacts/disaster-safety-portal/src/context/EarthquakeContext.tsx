import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import type { EarthquakeEvent } from "@/lib/kmaEarthquake";

export type { EarthquakeEvent };

interface EarthquakeState {
  data: EarthquakeEvent[];
  fetchedAt: string | null;
  loading: boolean;
  error: string | null;
  lastRefresh: Date | null;
  source: string | null;
  refetch: () => void;
}

const EarthquakeContext = createContext<EarthquakeState>({
  data: [],
  fetchedAt: null,
  loading: true,
  error: null,
  lastRefresh: null,
  source: null,
  refetch: () => {},
});

const REFRESH_INTERVAL = 60_000; // 공공 API 트래픽 고려 (1분)

export function EarthquakeProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<EarthquakeEvent[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [source, setSource] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setLoading(true);
    setError(null);
    try {
      // Vite 미들웨어 → 기상청 공공데이터포털 EqkInfoService
      const res = await fetch("/api/earthquake/recent", { signal: ctrl.signal });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error ?? `API 오류 HTTP ${res.status}`);
      }
      setData(json.data ?? []);
      setFetchedAt(json.fetchedAt ?? null);
      setSource(json.source ?? "kma-eqk-info");
      setLastRefresh(new Date());
    } catch (e: unknown) {
      if (e instanceof Error && e.name === "AbortError") return;
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const id = setInterval(fetchData, REFRESH_INTERVAL);
    return () => {
      clearInterval(id);
      abortRef.current?.abort();
    };
  }, [fetchData]);

  return (
    <EarthquakeContext.Provider
      value={{ data, fetchedAt, loading, error, lastRefresh, source, refetch: fetchData }}
    >
      {children}
    </EarthquakeContext.Provider>
  );
}

export function useEarthquake() {
  return useContext(EarthquakeContext);
}

export function useLatestEarthquake() {
  const { data } = useContext(EarthquakeContext);
  return data[0] ?? null;
}
