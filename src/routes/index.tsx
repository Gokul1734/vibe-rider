import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Speedometer } from "@/features/speedometer/Speedometer";
import { Compass } from "@/features/compass/Compass";
import { TopBar } from "@/features/dashboard/TopBar";
import { RideStats } from "@/features/dashboard/RideStats";
import { WeatherWidget } from "@/features/dashboard/WeatherWidget";
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

      {/* Main area — 50% speedometer | 50% ride stats, overlays on bottom corners */}
      <div className="flex-1 flex flex-row gap-2 sm:gap-3 min-h-0 relative">
        {/* Left 50% — Speedometer */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-1/2 h-full glass-strong rounded-3xl p-3 sm:p-4 relative overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between mb-1 shrink-0">
            <div className="text-base sm:text-lg tracking-[0.3em] panel-label font-display font-semibold">
              SPEED
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${gps.active ? "bg-[var(--success)] animate-pulse" : "bg-foreground/30"}`}
              />
              <span className="text-sm sm:text-base panel-muted tracking-wider font-display font-semibold">
                {gps.active ? "LIVE" : "GPS OFF"}
              </span>
            </div>
          </div>
          <div className="flex-1 min-h-0 flex items-center justify-center">
            <Speedometer speed={speed} />
          </div>
          {gps.permission !== "granted" && (
            <button
              onClick={gps.enable}
              className="absolute inset-0 grid place-items-center bg-black/60 backdrop-blur-sm text-center px-4 z-30"
            >
              <div>
                <div className="font-display text-lg tracking-[0.3em] text-white/90 font-bold">
                  {gps.permission === "unsupported" ? "GPS UNAVAILABLE" : "ENABLE GPS"}
                </div>
                <div className="text-base text-white/60 mt-2">
                  {gps.permission === "denied"
                    ? "Permission denied — enable in browser settings"
                    : "Tap to allow location for live speed"}
                </div>
              </div>
            </button>
          )}
        </motion.section>

        {/* Right 50% — Ride Stats */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="w-1/2 h-full min-w-0"
        >
          <RideStats
            tripKm={gps.tripKm}
            rideSeconds={gps.rideSeconds}
            avgSpeed={gps.avgSpeed}
            onReset={gps.reset}
          />
        </motion.section>

        {/* Bottom-left overlay — Compass on top of speedometer */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="absolute bottom-3 left-3 z-20 pointer-events-auto"
        >
          <div className="glass-strong rounded-2xl p-2 sm:p-3 relative">
            <Compass heading={heading ?? 0} compact />
            {(permission === "unknown" || permission === "denied") && (
              <button
                onClick={enable}
                className="absolute inset-0 rounded-2xl grid place-items-center bg-black/60 backdrop-blur-sm text-center px-2"
              >
                <div>
                  <div className="font-display text-xs tracking-[0.2em] text-white/90 font-bold">
                    ENABLE COMPASS
                  </div>
                </div>
              </button>
            )}
            {permission === "unsupported" && (
              <div className="absolute -bottom-5 left-0 right-0 text-[10px] panel-muted tracking-widest text-center">
                SENSOR UNAVAILABLE
              </div>
            )}
          </div>
        </motion.div>

        {/* Bottom-right overlay — Weather on top of ride stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="absolute bottom-3 right-3 z-20 pointer-events-auto"
        >
          <WeatherWidget />
        </motion.div>
      </div>
    </div>
  );
}
