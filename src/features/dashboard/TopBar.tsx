import { Wifi, WifiOff, Maximize2, Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";
import { useDeviceHeading, useOnlineStatus } from "@/lib/sensors";
import { type ThemeMode, useTheme } from "@/hooks/use-theme";
import { Compass } from "../compass/Compass";
import { motion } from "motion/react";
import { WeatherWidget } from "./WeatherWidget";

const themeLabels: Record<ThemeMode, string> = {
  auto: "AUTO",
  light: "DAY",
  dark: "NIGHT",
};

function ThemeIcon({ mode }: { mode: ThemeMode }) {
  if (mode === "auto") return <Monitor className="w-6 h-6" />;
  if (mode === "light") return <Sun className="w-6 h-6" />;
  return <Moon className="w-6 h-6" />;
}

export function TopBar() {
  const [time, setTime] = useState<Date | null>(null);
  const [mounted, setMounted] = useState(false);
  const online = useOnlineStatus();
  const { mode, cycleMode } = useTheme();
  const { heading, permission, enable } = useDeviceHeading();

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  let hh = "--";
  let mm = "--";
  let ampm = "";
  if (time) {
    const h24 = time.getHours();
    const h12 = h24 % 12 || 12;
    hh = h12.toString().padStart(2, "0");
    mm = time.getMinutes().toString().padStart(2, "0");
    ampm = h24 >= 12 ? "PM" : "AM";
  }
  const dateLabel = time
    ? time.toLocaleDateString(undefined, {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="flex items-center justify-between gap-16 px-4 py-2 glass rounded-2xl shrink-0">
      <div className="flex flex-col gap-0.5 min-w-0">
        <div className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tabular-nums text-foreground text-glow-primary flex items-baseline gap-1 leading-none">
          <span>{hh}</span>
          <span className="opacity-50">:</span>
          <span>{mm}</span>
          <span className="text-xl sm:text-2xl panel-muted tracking-widest ml-2">{ampm}</span>
        </div>
        <div className="text-lg sm:text-xl lg:text-2xl tracking-wide uppercase panel-label font-display font-semibold truncate">
          {dateLabel}
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 text-foreground shrink-0">
        <div className="glass-strong rounded-2xl p-2 sm:p-3 relative">
          <Compass heading={heading ?? 0} compact />
          {(permission === "unknown" || permission === "denied") && (
            <button
              onClick={enable}
              className="absolute inset-0 rounded-2xl grid place-items-center bg-black/60 backdrop-blur-sm text-center px-2"
            >
              <div>
                <div className="font-display text-xs tracking-[0.2em] text-white/90 font-bold">
                  ENABLE COMPASS
                </div>
              </div>
            </button>
          )}
          {permission === "unsupported" && (
            <div className="absolute -bottom-5 left-0 right-0 text-[10px] panel-muted tracking-widest text-center">
              SENSOR UNAVAILABLE
            </div>
          )}
        </div>
        <WeatherWidget />
        <button
          onClick={cycleMode}
          className="flex items-center gap-2 px-12 py-18 rounded-xl hover:bg-foreground/5 border border-[var(--panel-border)]"
          aria-label={`Theme: ${themeLabels[mode]}. Tap to switch.`}
          title={`Theme: ${themeLabels[mode]}`}
        >
          <ThemeIcon mode={mode} />
          <span className="font-display text-2xl sm:text-base tracking-widest font-bold hidden sm:inline">
            {themeLabels[mode]}
          </span>
        </button>
      </div>
    </div>
  );
}
