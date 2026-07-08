import {
  Bluetooth, Battery, Signal, Cloud, Thermometer,
  Sun, Menu, Maximize2, Bell, Wifi,
} from "lucide-react";
import { useEffect, useState } from "react";

export function TopBar() {
  const [time, setTime] = useState<Date | null>(null);
  useEffect(() => {
    setTime(new Date());
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = time ? time.getHours().toString().padStart(2, "0") : "--";
  const mm = time ? time.getMinutes().toString().padStart(2, "0") : "--";


  return (
    <div className="flex items-center justify-between px-4 py-2 glass rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg grid place-items-center"
            style={{ background: "linear-gradient(135deg, var(--primary), transparent)" }}>
            <span className="font-display font-black text-black text-sm">R</span>
          </div>
          <div className="font-display font-bold tracking-widest text-sm text-white/90">RIDEDECK</div>
        </div>
        <div className="h-6 w-px bg-white/10" />
        <div className="font-display font-bold text-2xl tabular-nums text-white text-glow-primary">
          {hh}<span className="opacity-60 mx-0.5">:</span>{mm}
        </div>
      </div>

      <div className="flex items-center gap-4 text-white/70">
        <Stat icon={<Cloud className="w-4 h-4" />} label="Clear" />
        <Stat icon={<Thermometer className="w-4 h-4" />} label="26°C" />
        <Stat icon={<Sun className="w-4 h-4 text-[var(--warning)]" />} label="UV 4" />
        <div className="h-5 w-px bg-white/10" />
        <IconStat icon={<Signal className="w-4 h-4 text-[var(--success)]" />} />
        <IconStat icon={<Wifi className="w-4 h-4" />} />
        <IconStat icon={<Bluetooth className="w-4 h-4 text-[var(--accent)]" />} />
        <IconStat icon={<Bell className="w-4 h-4" />} />
        <div className="flex items-center gap-1">
          <Battery className="w-5 h-5 text-[var(--success)]" />
          <span className="text-xs font-mono tabular-nums">82%</span>
        </div>
        <button className="w-8 h-8 rounded-lg grid place-items-center hover:bg-white/5">
          <Maximize2 className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-lg grid place-items-center hover:bg-white/5">
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Stat({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-xs font-medium tracking-wide">
      {icon}
      <span className="tabular-nums">{label}</span>
    </div>
  );
}
function IconStat({ icon }: { icon: React.ReactNode }) {
  return <div className="grid place-items-center">{icon}</div>;
}
