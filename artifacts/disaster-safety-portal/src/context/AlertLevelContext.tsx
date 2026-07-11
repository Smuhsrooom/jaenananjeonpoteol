import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type AlertLevelId,
  getAlertLevel,
  suggestAlertFromLive,
  type AlertLevel,
} from "@/lib/alertLevels";
import { useEarthquake } from "@/context/EarthquakeContext";
import { useLatestVolcano } from "@/context/VolcanoContext";

interface AlertLevelState {
  levelId: AlertLevelId;
  level: AlertLevel;
  suggestedId: AlertLevelId;
  manual: boolean;
  setLevelId: (id: AlertLevelId) => void;
  followSuggested: () => void;
  /** 심각 단계 선택 시 대피 팝업 */
  seriousModalOpen: boolean;
  openSeriousModal: () => void;
  closeSeriousModal: () => void;
}

const Ctx = createContext<AlertLevelState | null>(null);

/** document 전역에 경보 테마 CSS 변수 적용 */
function applyCrisisTheme(level: AlertLevel) {
  const root = document.documentElement;
  root.dataset.alertLevel = level.id;
  root.style.setProperty("--crisis-color", level.color);
  root.style.setProperty("--crisis-soft", level.softColor);
  root.style.setProperty("--crisis-ink", level.inkColor);
  // 브랜드 포인트(네이비 대체) — 주요 UI 강조색
  root.style.setProperty("--brand-accent", level.color);
  root.style.setProperty("--brand-accent-ink", level.inkColor);
}

export function AlertLevelProvider({ children }: { children: React.ReactNode }) {
  const { data: eqData } = useEarthquake();
  const latestVol = useLatestVolcano();
  const maxMag = eqData.length ? Math.max(...eqData.map((e) => e.magnitude)) : null;

  const suggestedId = useMemo(
    () =>
      suggestAlertFromLive({
        maxMagnitude: maxMag,
        volcanoAlertLabel: latestVol?.alertLevel ?? latestVol?.title ?? null,
      }),
    [maxMag, latestVol],
  );

  const [levelId, setLevelIdState] = useState<AlertLevelId>("interest");
  const [manual, setManual] = useState(false);
  const [seriousModalOpen, setSeriousModalOpen] = useState(false);

  useEffect(() => {
    if (!manual) setLevelIdState(suggestedId);
  }, [suggestedId, manual]);

  const level = getAlertLevel(levelId);

  useEffect(() => {
    applyCrisisTheme(level);
  }, [level]);

  const setLevelId = useCallback((id: AlertLevelId) => {
    setManual(true);
    setLevelIdState(id);
    if (id === "serious") {
      setSeriousModalOpen(true);
    }
  }, []);

  const followSuggested = useCallback(() => {
    setManual(false);
    setLevelIdState(suggestedId);
    if (suggestedId === "serious") {
      setSeriousModalOpen(true);
    }
  }, [suggestedId]);

  const value: AlertLevelState = {
    levelId,
    level,
    suggestedId,
    manual,
    setLevelId,
    followSuggested,
    seriousModalOpen,
    openSeriousModal: () => setSeriousModalOpen(true),
    closeSeriousModal: () => setSeriousModalOpen(false),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAlertLevel() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAlertLevel must be used within AlertLevelProvider");
  return v;
}
