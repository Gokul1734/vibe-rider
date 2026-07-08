import { Gauge, Clock, TrendingUp, Mountain, Route, Timer } from "lucide-react";

export function RideStats({ speed }: { speed: number }) {
  const stats = [
    { icon: Route, label: "Trip A", value: "128.4", unit: "km", color: "var(--primary)" },
    { icon: Timer, label: "Ride Time", value: "02:47", unit: "hh:mm", color: "var(--accent)" },
    { icon: Gauge, label: "Avg", value: "68", unit: "km/h", color: "var(--success)" },
    { icon: TrendingUp, label: "Max", value: `${Math.max(184, Math.round(speed))}`, unit: "km/h", color: "var(--warning)" },
    { icon: Mountain, label: "Elev", value: "842", unit: "m", color: "var(--accent)" },
    { icon: Clock, label: "Moving", value: "94%", unit: "", color: "var(--success)" },
  ];
  return (
    <div className="glass-strong rounded-3xl p-3 h-full">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="text-[11px] tracking-[0.3em] text-white/50 font-display">RIDE STATS</div>
        <button className="text-[10px] text-[var(--primary)] hover:underline">Reset</button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl bg-black/40 border border-white/5 p-2.5">
            <div className="flex items-center gap-1.5 text-white/50 text-[10px] tracking-wider">
              <s.icon className="w-3 h-3" style={{ color: s.color }} />
              <span>{s.label.toUpperCase()}</span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <div
                className="font-display font-bold text-lg tabular-nums"
                style={{ color: s.color }}
              >
                {s.value}
              </div>
              <div className="text-[9px] text-white/40">{s.unit}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
