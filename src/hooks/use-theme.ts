import { useCallback, useEffect, useState } from "react";

export type ThemeMode = "auto" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

const STORAGE_KEY = "vibe-rider-theme";

function isNightHour(hour: number) {
  return hour >= 18 || hour < 6;
}

export function resolveTheme(mode: ThemeMode, now = new Date()): ResolvedTheme {
  if (mode === "light") return "light";
  if (mode === "dark") return "dark";
  return isNightHour(now.getHours()) ? "dark" : "light";
}

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "auto";
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "auto") return stored;
  return "auto";
}

export function useTheme() {
  const [mode, setModeState] = useState<ThemeMode>(readStoredMode);
  const [resolved, setResolved] = useState<ResolvedTheme>(() => resolveTheme(readStoredMode()));

  const applyTheme = useCallback((next: ResolvedTheme) => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(next);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", next === "dark" ? "#000000" : "#f5f5f5");
    setResolved(next);
  }, []);

  const setMode = useCallback(
    (next: ThemeMode) => {
      setModeState(next);
      localStorage.setItem(STORAGE_KEY, next);
      applyTheme(resolveTheme(next));
    },
    [applyTheme],
  );

  const cycleMode = useCallback(() => {
    const order: ThemeMode[] = ["auto", "light", "dark"];
    const idx = order.indexOf(mode);
    setMode(order[(idx + 1) % order.length]);
  }, [mode, setMode]);

  useEffect(() => {
    applyTheme(resolveTheme(mode));
  }, [mode, applyTheme]);

  useEffect(() => {
    if (mode !== "auto") return;
    const tick = () => applyTheme(resolveTheme("auto"));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [mode, applyTheme]);

  return { mode, resolved, setMode, cycleMode };
}
