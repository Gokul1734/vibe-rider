import { Wifi, WifiOff, Maximize2, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useOnlineStatus } from "@/lib/sensors";

export function TopBar() {
  const [time, setTime] = useState<Date | null>(null);
  const online = useOnlineStatus();

  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const hh = time ? time.getHours().toString().padStart(2, "0") : "--";
  const mm = time ? time.getMinutes().toString().padStart(2, "0") : "--";
  const dateLabel = time
    ? time.toLocaleDateString(undefined, { weekday: "short", day: "2-digit", month: "short" })
    : "";

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.().catch(() => {});
    else document.exitFullscreen?.().catch(() => {});
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 glass rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg grid place-items-center"
            style={{ background: "linear-gradient(135deg, var(--primary), transparent)" }}
          >
            <span className="font-display font-black text-black text-sm">R</span>
          </div>
          <div className="font-display font-bold tracking-widest text-sm text-white/90">
            RIDEDECK
          </div>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="font-display font-bold text-2xl tabular-nums text-white text-glow-primary">
          {hh}
          <span className="opacity-60 mx-0.5">:</span>
          {mm}
        </div>
        <div className="text-[11px] tracking-widest uppercase text-white/50 font-display">
          {dateLabel}
        </div>
      </div>

      <div className="flex items-center gap-3 text-white/70">
        <div
          className={`flex items-center gap-1.5 text-xs font-medium tracking-wide ${
            online ? "text-[var(--success)]" : "text-[var(--danger)]"
          }`}
        >
          {online ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          <span className="tabular-nums">{online ? "ONLINE" : "OFFLINE"}</span>
        </div>
        <button
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-lg grid place-items-center hover:bg-white/5"
          aria-label="Toggle fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          className="w-8 h-8 rounded-lg grid place-items-center hover:bg-white/5"
          aria-label="Menu"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
