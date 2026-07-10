import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Speedometer } from "@/features/speedometer/Speedometer";
import { TopBar } from "@/features/dashboard/TopBar";
import { RideStats } from "@/features/dashboard/RideStats";
import { useGps } from "@/lib/gps";
import { useWakeLock } from "@/lib/wake-lock";
import { primeAudio } from "@/lib/beep";
import { useDeviceHeading } from "@/lib/sensors";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Dashboard() {
  const gps = useGps();
  const heading = useDeviceHeading();
  useWakeLock(true);

  const handleEnable = async () => {
    primeAudio();
    gps.enable();
    if (heading.permission !== "granted") {
      try {
        await heading.enable();
      } catch {
        /* noop */
      }
    }
  };

  return (
    <div className="h-screen w-[106%] p-4 overflow-hidden">
      <div className="grid h-full grid-cols-2 gap-2">
        {/* ================= LEFT COLUMN ================= */}
        <div className="grid grid-rows-[100px_280px_100px] gap-3 min-h-0">
          <TopBar />

          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="min-h-0 max-w-100"
          >
            <RideStats
              tripKm={gps.tripKm}
              rideSeconds={gps.rideSeconds}
              avgSpeed={gps.avgSpeed}
              onReset={gps.reset}
            />
          </motion.section>
        </div>

        {/* ================= RIGHT COLUMN ================= */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="glass-strong rounded-3xl p-4 relative overflow-hidden flex flex-col"
        >
          <div className="flex items-center justify-between shrink-0">
            <h2 className="panel-label tracking-[0.3em]">SPEED</h2>
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  gps.active ? "bg-[var(--success)] animate-pulse" : "bg-white/30"
                }`}
              />
              <span className="panel-muted">{gps.active ? "LIVE" : "GPS OFF"}</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <div className="h-full aspect-square flex items-center justify-center">
              <Speedometer speed={gps.speed} />
            </div>
          </div>

          {gps.permission !== "granted" && (
            <button
              onClick={handleEnable}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm grid place-items-center z-30 rounded-3xl"
            >
              <div className="text-center px-6">
                <div className="text-xl font-bold text-white tracking-wider">
                  {gps.permission === "unsupported" ? "GPS UNAVAILABLE" : "TAP TO START"}
                </div>
                <div className="text-white/60 mt-2 text-sm">
                  {gps.permission === "denied"
                    ? "Permission denied — enable location in browser settings"
                    : "Allow location & motion access for live speed and compass"}
                </div>
              </div>
            </button>
          )}
        </motion.section>
      </div>
    </div>
  );
}
