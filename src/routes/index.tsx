import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Speedometer } from "@/features/speedometer/Speedometer";
import { Compass } from "@/features/compass/Compass";
import { SpotifyPlayer } from "@/features/spotify/SpotifyPlayer";
import { TopBar } from "@/features/dashboard/TopBar";
import { RideStats } from "@/features/dashboard/RideStats";
import { useDeviceHeading } from "@/lib/sensors";
import { useGps } from "@/lib/gps";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const gps = useGps();
  const { heading: sensorHeading, permission, enable } = useDeviceHeading();
  const heading = sensorHeading ?? gps.heading;
  const speed = gps.speed;

  return (
    <div className="h-screen w-screen p-2 sm:p-3 flex flex-col gap-2 sm:gap-3 overflow-hidden">
      <TopBar />

      {/* Main area — responsive: stacks on portrait mobile, row on landscape */}
      <div className="flex-1 flex flex-col landscape:flex-row gap-2 sm:gap-3 min-h-0">
        {/* Speedometer — 1:1 square, full height */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-strong rounded-3xl p-3 relative overflow-hidden shrink-0 flex items-center justify-center aspect-square landscape:h-full landscape:w-auto w-full max-w-full"
        >
          <div className="absolute top-3 left-4 text-[11px] tracking-[0.3em] text-white/50 font-display z-10">
            SPEED
          </div>
          <div className="absolute top-3 right-4 flex items-center gap-1 z-10">
            <span
              className={`w-1.5 h-1.5 rounded-full ${gps.active ? "bg-[var(--success)] animate-pulse" : "bg-white/30"}`}
            />
            <span className="text-[10px] text-white/60 tracking-wider font-display">
              {gps.active ? "LIVE" : "GPS OFF"}
            </span>
          </div>
          <div className="w-full h-full flex items-center justify-center">
            <Speedometer speed={speed} />
          </div>
          {gps.permission !== "granted" && (
            <button
              onClick={gps.enable}
              className="absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-sm text-center px-4"
            >
              <div>
                <div className="font-display text-xs tracking-[0.3em] text-white/90">
                  {gps.permission === "unsupported" ? "GPS UNAVAILABLE" : "ENABLE GPS"}
                </div>
                <div className="text-[10px] text-white/50 mt-1">
                  {gps.permission === "denied"
                    ? "Permission denied — enable in browser settings"
                    : "Tap to allow location for live speed"}
                </div>
              </div>
            </button>
          )}
        </motion.section>

        {/* Middle column — Ride Stats */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="flex-1 min-h-0 min-w-0"
        >
          <RideStats
            tripKm={gps.tripKm}
            rideSeconds={gps.rideSeconds}
            avgSpeed={gps.avgSpeed}
            onReset={gps.reset}
          />
        </motion.section>

        {/* Right column — Compass + Weather stacked */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col gap-2 sm:gap-3 min-h-0 landscape:w-56 xl:landscape:w-64 w-full"
        >
          <div className="glass-strong rounded-3xl p-3 flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-0">
            <Compass heading={heading ?? 0} />
            {(permission === "unknown" || permission === "denied") && (
              <button
                onClick={enable}
                className="absolute inset-0 rounded-3xl grid place-items-center bg-black/60 backdrop-blur-sm text-center px-4"
              >
                <div>
                  <div className="font-display text-xs tracking-[0.3em] text-white/90">
                    ENABLE COMPASS
                  </div>
                  <div className="text-[10px] text-white/50 mt-1">Tap to allow motion sensor</div>
                </div>
              </button>
            )}
            {permission === "unsupported" && (
              <div className="absolute bottom-2 text-[9px] text-white/40 tracking-widest">
                SENSOR UNAVAILABLE
              </div>
            )}
          </div>

          <div className="glass-strong rounded-3xl p-3 flex-1 flex flex-col justify-between relative overflow-hidden min-h-0">
            <div className="text-[11px] tracking-[0.3em] text-white/50 font-display">WEATHER</div>
            <div className="flex items-end justify-between gap-2">
              <div>
                <div className="font-display text-3xl font-bold text-white text-glow-accent">26°</div>
                <div className="text-[11px] text-white/60">Feels 28° · Clear</div>
              </div>
              <div className="text-right text-[10px] text-white/60 space-y-0.5">
                <div>Wind <span className="text-white">12</span></div>
                <div>Rain <span className="text-white">0%</span></div>
              </div>
            </div>
            <div
              className="pointer-events-none absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-40"
              style={{ background: "radial-gradient(circle, var(--warning), transparent 70%)" }}
            />
          </div>
        </motion.section>
      </div>

      {/* Compact music player */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="shrink-0"
      >
        <SpotifyPlayer />
      </motion.section>
    </div>
  );
}
