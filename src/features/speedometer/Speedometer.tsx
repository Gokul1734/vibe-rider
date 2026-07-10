import { motion, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";
import { useSpeedBeep } from "@/lib/beep";

const MAX_SPEED = 120;

export function Speedometer({ speed }: { speed: number }) {
  const clamped = Math.min(MAX_SPEED, Math.max(0, speed));
  const pct = clamped / MAX_SPEED;
  const angle = -135 + pct * 270;

  useSpeedBeep(clamped, [50, 100]);

  const spring = useSpring(angle, {
    stiffness: 120,
    damping: 20,
    mass: 0.6,
  });

  useEffect(() => {
    spring.set(angle);
  }, [angle, spring]);

  const rotate = useTransform(spring, (v) => `rotate(${v}deg)`);

  const color =
    clamped >= 100
      ? "var(--danger)"
      : clamped >= 50
      ? "var(--primary)"
      : "var(--success)";

  const ticks = Array.from({ length: 25 }, (_, i) => i * 5);

  return (
    <div className="relative aspect-square w-full h-full mx-auto">
      {/* Progress Ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(
            from 225deg,
            ${color} 0deg,
            ${color} ${pct * 270}deg,
            transparent ${pct * 270}deg,
            transparent 360deg
          )`,
          filter: "blur(1px)",
          mask: "radial-gradient(circle, transparent 63%, black 64%, black 71%, transparent 72%)",
          WebkitMask:
            "radial-gradient(circle, transparent 63%, black 64%, black 71%, transparent 72%)",
          boxShadow: `0 0 35px ${color}`,
        }}
      />

      {/* Outer Ring */}
      <div
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: "var(--speed-ring-border)" }}
      />

      {/* Glass */}
      <div className="absolute inset-3 rounded-full glass-strong" />

      {/* Scale */}
      <svg viewBox="0 0 200 200" className="absolute inset-0">
        {ticks.map((value) => {
          // Sweep from 135° (lower-left, speed=0) clockwise 270° to 45° (lower-right, speed=max)
          const a = 135 + (value / MAX_SPEED) * 270;
          const rad = (a * Math.PI) / 180;
          const major = value % 20 === 0;
          const outerRadius = 76;
          const innerRadius = major ? 63 : 69;
          const x1 = 100 + Math.cos(rad) * outerRadius;
          const y1 = 100 + Math.sin(rad) * outerRadius;
          const x2 = 100 + Math.cos(rad) * innerRadius;
          const y2 = 100 + Math.sin(rad) * innerRadius;
          return (
            <line
              key={value}
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
          .filter((v) => v % 20 === 0)
          .map((value) => {
            const a = 135 + (value / MAX_SPEED) * 270;
            const rad = (a * Math.PI) / 180;
            const x = 100 + Math.cos(rad) * 54;
            const y = 100 + Math.sin(rad) * 54;
            return (
              <text
                key={value}
                x={x}
                y={y}
                fill="var(--speed-label)"
                fontSize="9"
                fontFamily="Orbitron"
                fontWeight="700"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {value}
              </text>
            );
          })}
      </svg>

      {/* Needle — sweeps 0..120 as before */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ transform: rotate }}
      >
        <div
          className="h-[48%] w-[3px] -translate-y-[24%] rounded-full"
          style={{
            background: `linear-gradient(to top, transparent, ${color})`,
            boxShadow: `0 0 18px ${color}`,
          }}
        />
      </motion.div>

      {/* Hub */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-5 h-5 rounded-full border-2"
          style={{
            background: "var(--speed-hub-bg)",
            borderColor: "var(--speed-hub-border)",
            boxShadow: "0 0 14px rgba(0,0,0,.25)",
          }}
        />
      </div>

      {/* Speed number — tucked into the bottom dead zone between the 0 and
          MAX ticks, where the needle never sweeps. No KM/H label. */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-[8%] font-display font-black leading-none tabular-nums"
          style={{
            color,
            fontSize: "clamp(2.5rem, 9vw, 6rem)",
            textShadow: `0 0 28px color-mix(in oklab, ${color} 70%, transparent)`,
            letterSpacing: "-0.04em",
          }}
        >
          {Math.round(clamped).toString().padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}
