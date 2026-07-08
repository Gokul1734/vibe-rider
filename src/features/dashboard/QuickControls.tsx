import {
  Sun, Palette, Volume2, VolumeX, Navigation, Bike, Siren,
  Settings, Maximize, Search,
} from "lucide-react";
import { useState } from "react";

export function QuickControls() {
  const [muted, setMuted] = useState(false);
  const items = [
    { icon: Sun, label: "Bright", color: "var(--warning)" },
    { icon: Palette, label: "Theme", color: "var(--accent)" },
    { icon: muted ? VolumeX : Volume2, label: muted ? "Muted" : "Sound", color: "var(--primary)", onClick: () => setMuted(v => !v) },
    { icon: Navigation, label: "Route", color: "var(--accent)" },
    { icon: Search, label: "Search", color: "var(--primary)" },
    { icon: Bike, label: "Find", color: "var(--success)" },
    { icon: Siren, label: "SOS", color: "var(--danger)" },
    { icon: Maximize, label: "Full", color: "var(--accent)" },
    { icon: Settings, label: "More", color: "white" },
  ];
  return (
    <div className="glass-strong rounded-3xl p-3 h-full">
      <div className="text-[11px] tracking-[0.3em] text-white/50 font-display mb-2 px-1">
        QUICK CONTROLS
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((it) => (
          <button
            key={it.label}
            onClick={it.onClick}
            className="group flex flex-col items-center justify-center gap-1 rounded-2xl bg-black/40 border border-white/5 py-2.5 hover:border-white/20 hover:bg-white/5 transition min-h-[52px]"
          >
            <it.icon
              className="w-4 h-4"
              style={{ color: it.color, filter: `drop-shadow(0 0 6px ${it.color})` }}
            />
            <span className="text-[10px] text-white/70 tracking-wider">{it.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
