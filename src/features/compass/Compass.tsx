import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function Compass({ heading }: { heading: number }) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const cardinal = dirs[Math.round(heading / 45) % 8];
  return (
    <div className="relative w-full aspect-square max-w-[140px] mx-auto">
      <div className="absolute inset-0 rounded-full glass-strong" />
      <div className="absolute inset-2 rounded-full border border-white/10" />
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0"
        animate={{ rotate: -heading }}
        transition={{ type: "spring", stiffness: 60, damping: 14 }}
      >
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i * 10 * Math.PI) / 180;
          const major = i % 9 === 0;
          const x1 = 50 + Math.sin(a) * 44;
          const y1 = 50 - Math.cos(a) * 44;
          const x2 = 50 + Math.sin(a) * (major ? 36 : 40);
          const y2 = 50 - Math.cos(a) * (major ? 36 : 40);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={major ? "white" : "rgba(255,255,255,0.3)"}
              strokeWidth={major ? 1.2 : 0.5} strokeLinecap="round" />
          );
        })}
        {["N", "E", "S", "W"].map((l, i) => {
          const a = (i * 90 * Math.PI) / 180;
          const x = 50 + Math.sin(a) * 28;
          const y = 50 - Math.cos(a) * 28;
          return (
            <text key={l} x={x} y={y} fill={l === "N" ? "var(--primary)" : "rgba(255,255,255,0.7)"}
              fontSize="9" fontFamily="Orbitron" fontWeight={700}
              textAnchor="middle" dominantBaseline="middle">{l}</text>
          );
        })}
      </motion.svg>
      {/* Fixed needle */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-[3px] h-[38%] bg-gradient-to-t from-transparent via-[var(--primary)] to-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary)]" />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center translate-y-6">
          <div className="font-display text-lg font-bold text-white text-glow-primary">{cardinal}</div>
          <div className="font-mono text-[10px] text-white/60">{Math.round(heading)}°</div>
        </div>
      </div>
    </div>
  );
}

export function useDemoHeading() {
  const [h, setH] = useState(42);
  useEffect(() => {
    const id = setInterval(() => setH((v) => (v + (Math.random() - 0.4) * 8 + 360) % 360), 900);
    return () => clearInterval(id);
  }, []);
  return h;
}
