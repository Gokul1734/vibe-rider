import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Speedometer, useDemoSpeed } from "@/features/speedometer/Speedometer";
import { Compass, useDemoHeading } from "@/features/compass/Compass";
import { MiniMap } from "@/features/maps/MiniMap";
import { SpotifyPlayer } from "@/features/spotify/SpotifyPlayer";
import { TopBar } from "@/features/dashboard/TopBar";
import { RideStats } from "@/features/dashboard/RideStats";


export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const speed = useDemoSpeed();
  const heading = useDemoHeading();

  return (
    <div className="h-screen w-screen p-3 flex flex-col gap-3 overflow-hidden">
      {/* Orientation hint (portrait only) */}
      <div className="landscape:hidden absolute inset-0 z-50 grid place-items-center bg-black/95 p-6 text-center">
        <div>
          <div className="mx-auto w-16 h-16 rounded-2xl glass-strong grid place-items-center mb-4">
            <motion.div
              animate={{ rotate: 90 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.4 }}
              className="w-8 h-12 rounded border-2 border-white/70"
            />
          </div>
          <div className="font-display text-lg text-white">Rotate your device</div>
          <div className="text-sm text-white/60 mt-1">Ridedeck is optimized for landscape mode.</div>
        </div>
      </div>

      <TopBar />

      {/* Main grid */}
      <div className="flex-1 grid grid-cols-12 grid-rows-6 gap-3 min-h-0">
        {/* Speedometer */}
        <motion.section
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
          className="col-span-4 row-span-4 glass-strong rounded-3xl p-3 flex items-center justify-center relative"
        >
          <div className="absolute top-3 left-4 text-[11px] tracking-[0.3em] text-white/50 font-display">SPEED</div>
          <div className="absolute top-3 right-4 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--success)] animate-pulse" />
            <span className="text-[10px] text-white/60 tracking-wider font-display">LIVE</span>
          </div>
          <Speedometer speed={speed} />
          <div className="absolute bottom-3 left-3 right-3 flex justify-between text-[10px] text-white/50 font-mono">
            <span>LIMIT · 80</span>
            <span>MODE · SPORT</span>
            <span>GEAR · 4</span>
          </div>
        </motion.section>

        {/* Map */}
        <motion.section
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
          className="col-span-5 row-span-4"
        >
          <MiniMap />
        </motion.section>

        {/* Compass + weather stack */}
        <motion.section
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="col-span-3 row-span-4 flex flex-col gap-3 min-h-0"
        >
          <div className="glass-strong rounded-3xl p-3 flex-1 flex flex-col items-center justify-center relative">
            <div className="absolute top-3 left-4 text-[11px] tracking-[0.3em] text-white/50 font-display">COMPASS</div>
            <Compass heading={heading} />
          </div>
          <div className="glass-strong rounded-3xl p-3 flex-1 flex flex-col justify-between relative overflow-hidden">
            <div className="text-[11px] tracking-[0.3em] text-white/50 font-display">WEATHER</div>
            <div className="flex items-end justify-between">
              <div>
                <div className="font-display text-4xl font-bold text-white text-glow-accent">26°</div>
                <div className="text-xs text-white/60">Feels 28° · Clear</div>
              </div>
              <div className="text-right text-[11px] text-white/60 space-y-0.5">
                <div>Wind <span className="text-white">12 km/h</span></div>
                <div>Rain <span className="text-white">0%</span></div>
                <div>Humidity <span className="text-white">54%</span></div>
              </div>
            </div>
            <div
              className="pointer-events-none absolute -right-8 -top-8 w-40 h-40 rounded-full opacity-40"
              style={{ background: "radial-gradient(circle, var(--warning), transparent 70%)" }}
            />
          </div>
        </motion.section>

        {/* Bottom row — 5/7 split, no overlap */}
        <motion.section
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}
          className="col-span-5 row-span-2"
        >
          <RideStats speed={speed} />
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}
          className="col-span-7 row-span-2"
        >
          <SpotifyPlayer />
        </motion.section>

      </div>
    </div>
  );
}
