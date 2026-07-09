import { Route, Timer, Gauge, RotateCcw } from "lucide-react";
import { formatRideTime } from "@/lib/gps";

interface Props {
  tripKm: number;
  rideSeconds: number;
  avgSpeed: number;
  onReset?: () => void;
}

export function RideStats({ tripKm, rideSeconds, avgSpeed, onReset }: Props) {
  const stats = [
    {
      icon: Route,
      label: "Trip",
      value: tripKm.toFixed(tripKm < 100 ? 1 : 0),
      unit: "km",
      color: "var(--primary)",
    },
    {
      icon: Timer,
      label: "Ride Time",
      value: formatRideTime(rideSeconds),
      unit: "",
      color: "var(--accent)",
    },
    {
      icon: Gauge,
      label: "Avg Speed",
      value: Math.round(avgSpeed).toString(),
      unit: "km/h",
      color: "var(--success)",
    },
  ];

  return (
    <div className="glass-strong rounded-3xl p-4 sm:p-5 h-full flex flex-col">
      <div className="text-base sm:text-lg tracking-[0.35em] panel-label font-display font-semibold mb-4 px-1">
        RIDE STATS
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 flex-1 min-h-0">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-[var(--panel-border)] px-4 py-5 flex flex-col justify-between"
            style={{ background: "var(--panel-inner)" }}
          >
            <div className="flex items-center gap-2 panel-muted text-sm sm:text-base tracking-[0.15em] font-semibold">
              <s.icon className="w-6 h-6 shrink-0" style={{ color: s.color }} />
              <span>{s.label.toUpperCase()}</span>
            </div>
            <div className="flex items-baseline gap-2 leading-none mt-3">
              <div
                className="font-display font-black text-5xl sm:text-6xl lg:text-7xl tabular-nums"
                style={{ color: s.color, textShadow: `0 0 16px color-mix(in oklab, ${s.color} 50%, transparent)` }}
              >
                {s.value}
              </div>
              {s.unit && (
                <div className="text-lg sm:text-xl panel-muted tracking-wide font-semibold">{s.unit}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onReset}
        className="btn-cta mt-4 w-full py-4 sm:py-5 text-lg sm:text-xl flex items-center justify-center gap-3"
      >
        <RotateCcw className="w-6 h-6 sm:w-7 sm:h-7" />
        RESET TRIP
      </button>
    </div>
  );
}
