import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import type { VolcanoEvent } from "@/lib/kmaVolcano";

export type { VolcanoEvent };

interface VolcanoState {
  data: VolcanoEvent[];
  fetchedAt: string | null;
  loading: boolean;
  error: string | null;
  needsApplication: boolean;
  lastRefresh: Date | null;
  source: string | null;
  refetch: () => void;
}

const VolcanoContext = createContext<VolcanoState>({
  data: [],
  fetchedAt: null,
  loading: true,
  error: null,
  needsApplication: false,
  lastRefresh: null,
  source: null,
  refetch: () => {},
});

const REFRESH_INTERVAL = 120_000;

export function VolcanoProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<VolcanoEvent[]>([]);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsApplication, setNeedsApplication] = useState(false);
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
      const res = await fetch("/api/volcano/recent", { signal: ctrl.signal });
      const json = await res.json();
      setSource(json.source ?? "kma-apihub-volc");
      setFetchedAt(json.fetchedAt ?? null);
      setNeedsApplication(Boolean(json.needsApplication));
      setLastRefresh(new Date());

      if (!res.ok || !json.ok) {
        setData([]);
        setError(json.error ?? `API 오류 HTTP ${res.status}`);
        return;
      }
      setData(json.data ?? []);
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
    <VolcanoContext.Provider
      value={{
        data,
        fetchedAt,
        loading,
        error,
        needsApplication,
        lastRefresh,
        source,
        refetch: fetchData,
      }}
    >
      {children}
    </VolcanoContext.Provider>
  );
}

export function useVolcano() {
  return useContext(VolcanoContext);
}

export function useLatestVolcano() {
  const { data } = useContext(VolcanoContext);
  return data[0] ?? null;
}
