import { Route, Timer, Gauge } from "lucide-react";

export function RideStats() {
  const stats = [
    { icon: Route, label: "Trip", value: "128.4", unit: "km", color: "var(--primary)" },
    { icon: Timer, label: "Ride Time", value: "02:47", unit: "", color: "var(--accent)" },
    { icon: Gauge, label: "Avg Speed", value: "68", unit: "km/h", color: "var(--success)" },
  ];
  return (
    <div className="glass-strong rounded-3xl p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className="text-[11px] tracking-[0.35em] text-white/50 font-display">RIDE STATS</div>
        <button className="text-[10px] tracking-widest text-[var(--primary)] hover:underline">RESET</button>
      </div>
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-0">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl bg-black/40 border border-white/5 px-4 py-4 flex flex-col justify-between"
          >
            <div className="flex items-center gap-2 text-white/55 text-[11px] tracking-[0.15em]">
              <s.icon className="w-4 h-4 shrink-0" style={{ color: s.color }} />
              <span>{s.label.toUpperCase()}</span>
            </div>
            <div className="flex items-baseline gap-1.5 leading-none mt-2">
              <div
                className="font-display font-bold text-3xl tabular-nums"
                style={{ color: s.color, textShadow: `0 0 12px ${s.color}` }}
              >
                {s.value}
              </div>
              {s.unit && (
                <div className="text-[11px] text-white/45 tracking-wide">{s.unit}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
