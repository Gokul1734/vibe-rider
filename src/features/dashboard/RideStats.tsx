import { Route, Timer, Gauge, RotateCcw } from "lucide-react";
import { formatRideTime } from "@/lib/gps";
import { Compass } from "../compass/Compass";
import type { LucideIcon } from "lucide-react";

interface Props {
  tripKm: number;
  rideSeconds: number;
  avgSpeed: number;
  heading: number;
  onReset?: () => void;
}

interface StatRowProps {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}

function StatRow({
  icon: Icon,
  label,
  value,
  color,
}: StatRowProps) {
  return (
    <div className="flex items-center gap-3">

      <Icon
        className="w-6 h-6 shrink-0"
        style={{ color }}
      />

      <div className="flex-1">

        <div className="text-xs uppercase tracking-widest panel-muted">
          {label}
        </div>

        <div
          className="font-display text-3xl font-bold"
          style={{ color }}
        >
          {value}
        </div>

      </div>

    </div>
  );
}

export function RideStats({ tripKm, rideSeconds, avgSpeed, heading, onReset }: Props) {
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
    <div className="glass-strong rounded-3xl h-[280px] p-5 flex flex-col">
  
      {/* Content */}
      <div className="flex flex-1 gap-4 min-h-0">
  
        {/* Stats */}
        <div className="flex-1 flex flex-col justify-start space-y-2">
  
          <StatRow
            icon={Route}
            label="Trip"
            value={`${tripKm.toFixed(1)} km`}
            color="var(--primary)"
          />
  
          <StatRow
            icon={Timer}
            label="Time"
            value={formatRideTime(rideSeconds)}
            color="var(--accent)"
          />
  
          <StatRow
            icon={Gauge}
            label="Avg"
            value={`${Math.round(avgSpeed)} km/h`}
            color="var(--success)"
          />
  
        </div>
  
        {/* Compass */}
        <div className="w-36 flex items-end justify-center rounded-2xl">
          <Compass heading={heading} compact />
        </div>
  
      </div>
  
      {/* Button */}
      <button
        onClick={onReset}
        className="btn-cta mt-5 h-13 text-lg flex items-center justify-center gap-3"
      >
        <RotateCcw className="w-5 h-5" />
        RESET TRIP
      </button>
  
    </div>
  );
}
