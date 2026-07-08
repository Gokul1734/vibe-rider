import { motion } from "motion/react";
import {
  Navigation2, MapPin, Fuel, Coffee, Wrench, Plus, Minus, Locate,
} from "lucide-react";

export function MiniMap({ eta = "18 min", distance = "12.4 km", next = "Turn right onto MG Road" }: {
  eta?: string; distance?: string; next?: string;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-3xl glass-strong">
      {/* Faux dark map */}
      <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="mapbg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0b1220" />
            <stop offset="100%" stopColor="#020409" />
          </radialGradient>
        </defs>
        <rect width="400" height="260" fill="url(#mapbg)" />
        {/* grid */}
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 22} y1={0} x2={i * 22} y2={260}
            stroke="rgba(120,150,200,0.06)" strokeWidth={1} />
        ))}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 22} x2={400} y2={i * 22}
            stroke="rgba(120,150,200,0.06)" strokeWidth={1} />
        ))}
        {/* Roads */}
        <path d="M -20 220 C 80 200, 140 150, 210 140 S 340 120, 430 70"
          stroke="rgba(140,170,220,0.35)" strokeWidth={10} fill="none" strokeLinecap="round" />
        <path d="M -20 220 C 80 200, 140 150, 210 140 S 340 120, 430 70"
          stroke="rgba(200,220,255,0.9)" strokeWidth={2} fill="none" strokeLinecap="round" />
        <path d="M 60 -10 C 90 60, 180 80, 210 140 S 260 260, 300 300"
          stroke="rgba(140,170,220,0.25)" strokeWidth={6} fill="none" strokeLinecap="round" />
        {/* Route */}
        <motion.path
          d="M 70 230 C 130 210, 170 170, 210 140 S 320 90, 380 60"
          stroke="var(--primary)"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
          strokeDasharray="6 8"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -140 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          style={{ filter: "drop-shadow(0 0 8px var(--primary))" }}
        />
        {/* Destination pin */}
        <g transform="translate(380 60)">
          <circle r="8" fill="var(--primary)" opacity="0.25" />
          <circle r="4" fill="var(--primary)" />
        </g>
        {/* You */}
        <g transform="translate(70 230)">
          <circle r="12" fill="var(--accent)" opacity="0.2" />
          <circle r="6" fill="var(--accent)" stroke="white" strokeWidth={1.5} />
        </g>
      </svg>

      {/* Navigation card */}
      <div className="absolute left-3 top-3 right-3 flex items-start justify-between gap-3">
        <div className="glass rounded-2xl px-3 py-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/15 border border-[var(--primary)]/30 grid place-items-center">
            <Navigation2 className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm text-white/90">{next}</div>
            <div className="text-[11px] text-white/50">in 400 m</div>
          </div>
        </div>
        <div className="glass rounded-2xl px-3 py-2 text-right">
          <div className="font-display text-xl text-white text-glow-primary tabular-nums">{eta}</div>
          <div className="text-[11px] text-white/60">{distance}</div>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute right-3 bottom-3 flex flex-col gap-2">
        <button className="w-9 h-9 rounded-xl glass grid place-items-center text-white/80 hover:text-white">
          <Plus className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-xl glass grid place-items-center text-white/80 hover:text-white">
          <Minus className="w-4 h-4" />
        </button>
        <button className="w-9 h-9 rounded-xl glass grid place-items-center text-[var(--accent)]">
          <Locate className="w-4 h-4" />
        </button>
      </div>

      {/* POI chips */}
      <div className="absolute left-3 bottom-3 flex gap-2">
        {[
          { icon: Fuel, label: "Fuel" },
          { icon: Coffee, label: "Rest" },
          { icon: Wrench, label: "Repair" },
          { icon: MapPin, label: "Saved" },
        ].map(({ icon: Icon, label }) => (
          <button key={label}
            className="glass rounded-full px-3 py-1.5 flex items-center gap-1.5 text-[11px] text-white/80 hover:text-white">
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
