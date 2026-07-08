import { motion, useMotionValue, useSpring, useTransform, animate } from "motion/react";
import { useEffect, useState } from "react";

const MAX_SPEED = 240;

export function Speedometer({ speed }: { speed: number }) {
  // Arc: -135deg to +135deg (270deg sweep)
  const pct = Math.min(1, Math.max(0, speed / MAX_SPEED));
  const angle = -135 + pct * 270;

  const spring = useSpring(angle, { stiffness: 120, damping: 20, mass: 0.6 });
  useEffect(() => { spring.set(angle); }, [angle, spring]);
  const rotate = useTransform(spring, (v) => `rotate(${v}deg)`);

  const color =
    speed > 180 ? "var(--danger)" : speed > 120 ? "var(--primary)" : "var(--success)";

  // Ticks
  const ticks = Array.from({ length: 25 }, (_, i) => i); // every 10 kmh
  return (
    <div className="relative aspect-square w-full max-w-[420px] mx-auto">
      {/* Outer glow ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from 225deg, ${color} 0deg, ${color} ${pct * 270}deg, transparent ${pct * 270}deg, transparent 270deg, transparent 360deg)`,
          filter: "blur(1px)",
          mask: "radial-gradient(circle, transparent 62%, black 63%, black 72%, transparent 73%)",
          WebkitMask: "radial-gradient(circle, transparent 62%, black 63%, black 72%, transparent 73%)",
          opacity: 0.95,
          boxShadow: `0 0 40px ${color}`,
        }}
      />
      {/* Base ring */}
      <div className="absolute inset-0 rounded-full border border-white/10" />
      <div className="absolute inset-3 rounded-full glass-strong" />

      {/* Ticks */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-[135deg]">
        {ticks.map((i) => {
          const a = (i / 24) * 270;
          const major = i % 3 === 0;
          const len = major ? 12 : 6;
          const x1 = 100 + Math.cos((a * Math.PI) / 180) * 82;
          const y1 = 100 + Math.sin((a * Math.PI) / 180) * 82;
          const x2 = 100 + Math.cos((a * Math.PI) / 180) * (82 - len);
          const y2 = 100 + Math.sin((a * Math.PI) / 180) * (82 - len);
          return (
            <line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={major ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.25)"}
              strokeWidth={major ? 1.4 : 0.8}
              strokeLinecap="round"
            />
          );
        })}
        {ticks.filter(i => i % 3 === 0).map((i) => {
          const a = (i / 24) * 270;
          const x = 100 + Math.cos((a * Math.PI) / 180) * 62;
          const y = 100 + Math.sin((a * Math.PI) / 180) * 62;
          return (
            <text
              key={`t${i}`}
              x={x} y={y}
              fill="rgba(255,255,255,0.55)"
              fontSize="7"
              fontFamily="Orbitron"
              textAnchor="middle"
              dominantBaseline="middle"
              transform={`rotate(135 ${x} ${y})`}
            >
              {i * 10}
            </text>
          );
        })}
      </svg>

      {/* Needle */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: rotate }}
      >
        <div
          className="h-[46%] w-[3px] -translate-y-[23%] rounded-full"
          style={{
            background: `linear-gradient(to top, transparent, ${color})`,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      </motion.div>

      {/* Hub */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full bg-black border-2 border-white/30 shadow-[0_0_16px_rgba(255,255,255,0.15)]" />
      </div>

      {/* Digital readout */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-[26%]">
        <div
          className="font-display font-black text-6xl leading-none tabular-nums"
          style={{ color, textShadow: `0 0 20px ${color}` }}
        >
          {Math.round(speed).toString().padStart(2, "0")}
        </div>
        <div className="mt-1 text-xs tracking-[0.35em] text-white/60 font-display">
          KM/H
        </div>
      </div>
    </div>
  );
}

/** Convenience: animated demo speed */
export function useDemoSpeed() {
  const speed = useMotionValue(0);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const unsub = speed.on("change", (v) => setDisplay(v));
    const loop = () => {
      const target = 40 + Math.random() * 160;
      animate(speed, target, {
        duration: 3 + Math.random() * 3,
        ease: "easeInOut",
        onComplete: loop,
      });
    };
    loop();
    return () => unsub();
  }, [speed]);
  return display;
}
