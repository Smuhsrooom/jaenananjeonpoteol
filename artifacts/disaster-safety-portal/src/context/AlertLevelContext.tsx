import { createContext, useContext, useMemo, useState, useEffect } from "react";
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
}

const Ctx = createContext<AlertLevelState | null>(null);

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

  const [levelId, setLevelId] = useState<AlertLevelId>("interest");
  const [manual, setManual] = useState(false);

  useEffect(() => {
    if (!manual) setLevelId(suggestedId);
  }, [suggestedId, manual]);

  const value: AlertLevelState = {
    levelId,
    level: getAlertLevel(levelId),
    suggestedId,
    manual,
    setLevelId: (id) => {
      setManual(true);
      setLevelId(id);
    },
    followSuggested: () => {
      setManual(false);
      setLevelId(suggestedId);
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAlertLevel() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAlertLevel must be used within AlertLevelProvider");
  return v;
}
