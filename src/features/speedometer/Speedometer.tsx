import { motion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

const MAX_SPEED = 240;

export function Speedometer({ speed }: { speed: number }) {
  const pct = Math.min(1, Math.max(0, speed / MAX_SPEED));
  const angle = -135 + pct * 270;

  const spring = useSpring(angle, { stiffness: 120, damping: 20, mass: 0.6 });
  useEffect(() => {
    spring.set(angle);
  }, [angle, spring]);
  const rotate = useTransform(spring, (v) => `rotate(${v}deg)`);

  const color =
    speed > 180 ? "var(--danger)" : speed > 120 ? "var(--primary)" : "var(--success)";

  const ticks = Array.from({ length: 25 }, (_, i) => i);

  return (
    <div className="relative aspect-square w-full h-full max-h-full mx-auto">
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
      <div
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: "var(--speed-ring-border)" }}
      />
      <div className="absolute inset-3 rounded-full glass-strong" />

      <svg viewBox="0 0 200 200" className="absolute inset-0 -rotate-[135deg]">
        {ticks.map((i) => {
          const a = (i / 24) * 270;
          const major = i % 3 === 0;
          const len = major ? 14 : 7;
          const x1 = 100 + Math.cos((a * Math.PI) / 180) * 82;
          const y1 = 100 + Math.sin((a * Math.PI) / 180) * 82;
          const x2 = 100 + Math.cos((a * Math.PI) / 180) * (82 - len);
          const y2 = 100 + Math.sin((a * Math.PI) / 180) * (82 - len);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={major ? "var(--speed-tick-major)" : "var(--speed-tick-minor)"}
              strokeWidth={major ? 2 : 1}
              strokeLinecap="round"
            />
          );
        })}
        {ticks
          .filter((i) => i % 3 === 0)
          .map((i) => {
            const a = (i / 24) * 270;
            const x = 100 + Math.cos((a * Math.PI) / 180) * 62;
            const y = 100 + Math.sin((a * Math.PI) / 180) * 62;
            return (
              <text
                key={`t${i}`}
                x={x}
                y={y}
                fill="var(--speed-label)"
                fontSize="9"
                fontFamily="Orbitron"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
                transform={`rotate(135 ${x} ${y})`}
              >
                {i * 10}
              </text>
            );
          })}
      </svg>

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: rotate }}
      >
        <div
          className="h-[46%] w-[4px] -translate-y-[23%] rounded-full"
          style={{
            background: `linear-gradient(to top, transparent, ${color})`,
            boxShadow: `0 0 14px ${color}`,
          }}
        />
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-8 h-8 rounded-full border-2 shadow-[0_0_16px_rgba(0,0,0,0.15)]"
          style={{
            background: "var(--speed-hub-bg)",
            borderColor: "var(--speed-hub-border)",
          }}
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none translate-y-[26%]">
        <div
          className="font-display font-black text-7xl sm:text-8xl lg:text-9xl leading-none tabular-nums"
          style={{ color, textShadow: `0 0 24px color-mix(in oklab, ${color} 60%, transparent)` }}
        >
          {Math.round(speed).toString().padStart(2, "0")}
        </div>
        <div className="mt-2 text-lg sm:text-xl tracking-[0.35em] panel-muted font-display font-bold">
          KM/H
        </div>
      </div>
    </div>
  );
}
