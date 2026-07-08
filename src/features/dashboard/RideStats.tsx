import { Gauge, Clock, TrendingUp, Mountain, Route, Timer } from "lucide-react";

export function RideStats({ speed }: { speed: number }) {
  const stats = [
    { icon: Route, label: "Trip A", value: "128.4", unit: "km", color: "var(--primary)" },
    { icon: Timer, label: "Ride Time", value: "02:47", unit: "hh:mm", color: "var(--accent)" },
    { icon: Gauge, label: "Avg Speed", value: "68", unit: "km/h", color: "var(--success)" },
    { icon: TrendingUp, label: "Max Speed", value: `${Math.max(184, Math.round(speed))}`, unit: "km/h", color: "var(--warning)" },
    { icon: Mountain, label: "Elevation", value: "842", unit: "m", color: "var(--accent)" },
    { icon: Clock, label: "Moving", value: "94", unit: "%", color: "var(--success)" },
  ];
  return (
    <div className="glass-strong rounded-3xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="text-[11px] tracking-[0.35em] text-white/50 font-display">RIDE STATS</div>
        <button className="text-[10px] tracking-widest text-[var(--primary)] hover:underline">RESET</button>
      </div>
      <div className="grid grid-cols-3 grid-rows-2 gap-3 flex-1 min-h-0">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-black/40 border border-white/5 px-3 py-2.5 flex flex-col justify-between min-w-0"
          >
            <div className="flex items-center gap-1.5 text-white/55 text-[10px] tracking-[0.15em]">
              <s.icon className="w-3.5 h-3.5 shrink-0" style={{ color: s.color }} />
              <span className="truncate">{s.label.toUpperCase()}</span>
            </div>
            <div className="flex items-baseline gap-1.5 leading-none">
              <div
                className="font-display font-bold text-2xl tabular-nums truncate"
                style={{ color: s.color, textShadow: `0 0 10px ${s.color}` }}
              >
                {s.value}
              </div>
              <div className="text-[10px] text-white/45 tracking-wide">{s.unit}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
