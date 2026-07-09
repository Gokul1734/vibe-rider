import { motion } from "motion/react";

interface Props {
  heading: number;
  compact?: boolean;
}

export function Compass({ heading, compact = false }: Props) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const cardinal = dirs[Math.round(heading / 45) % 8];
  const sizeClass = compact ? "w-[120px] sm:w-[140px]" : "w-full max-w-[200px]";

  return (
    <div className={`relative aspect-square ${sizeClass} mx-auto`}>
      <div className="absolute inset-0 rounded-full glass-strong" />
      <div
        className="absolute inset-2 rounded-full border"
        style={{ borderColor: "var(--speed-ring-border)" }}
      />
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
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={major ? "var(--speed-tick-major)" : "var(--speed-tick-minor)"}
              strokeWidth={major ? 1.5 : 0.6}
              strokeLinecap="round"
            />
          );
        })}
        {["N", "E", "S", "W"].map((l, i) => {
          const a = (i * 90 * Math.PI) / 180;
          const x = 50 + Math.sin(a) * 28;
          const y = 50 - Math.cos(a) * 28;
          return (
            <text
              key={l}
              x={x}
              y={y}
              fill={l === "N" ? "var(--primary)" : "var(--speed-label)"}
              fontSize="10"
              fontFamily="Orbitron"
              fontWeight={700}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {l}
            </text>
          );
        })}
      </motion.svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-[3px] h-[30%] bg-gradient-to-t from-transparent via-[var(--primary)] to-[var(--primary)] rounded-full shadow-[0_0_10px_var(--primary)]" />
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
       <motion.div
         className="relative w-2 h-16 origin-center"
         animate={{ rotate: heading }}
         transition={{
           type: "spring",
           stiffness: 80,
           damping: 16,
         }}
       >
         {/* North (Red) */}
         <div
           className="absolute left-1/2 -translate-x-1/2 top-0"
           style={{
             width: 0,
             height: 0,
             borderLeft: "6px solid transparent",
             borderRight: "6px solid transparent",
             borderBottom: "38px solid #ff3b30",
             filter: "drop-shadow(0 0 6px #ff3b30)",
           }}
         />

         {/* South (White) */}
         <div
           className="absolute left-1/2 -translate-x-1/2 bottom-0"
           style={{
             width: 0,
             height: 0,
             borderLeft: "6px solid transparent",
             borderRight: "6px solid transparent",
             borderTop: "28px solid #ffffff",
           }}
         />

         {/* Center Pivot */}
         <div
           className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
                      w-4 h-4 rounded-full border-2 border-white"
           style={{
             background: "var(--primary)",
             boxShadow: "0 0 12px var(--primary)",
           }}
         />
       </motion.div>
     </div>

      </div>
  );
}
