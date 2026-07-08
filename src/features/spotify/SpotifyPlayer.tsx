import { motion } from "motion/react";
import { Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

export function SpotifyPlayer() {
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(72);
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 0.5)), 500);
    return () => clearInterval(id);
  }, [playing]);

  return (
    <div className="glass-strong rounded-3xl p-3 h-full flex items-center gap-3">
      {/* Album art */}
      <div className="relative shrink-0">
        <motion.div
          className="w-20 h-20 rounded-2xl overflow-hidden"
          animate={{ rotate: playing ? 360 : 0 }}
          transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
          style={{
            background:
              "conic-gradient(from 0deg, #ff7a1a, #1ac6ff, #22ff9a, #ff7a1a)",
          }}
        >
          <div className="absolute inset-1 rounded-2xl bg-black grid place-items-center">
            <div className="w-3 h-3 rounded-full bg-white/70" />
          </div>
        </motion.div>
      </div>

      {/* Info + controls */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2">
          <div className="min-w-0">
            <div className="font-display text-sm text-white truncate">Midnight Rider</div>
            <div className="text-[11px] text-white/55 truncate">The Highway Collective</div>
          </div>
          <div className="text-[10px] font-mono text-white/50 tabular-nums shrink-0">
            {formatTime(progress * 2.4)} / 4:00
          </div>
        </div>

        {/* Progress */}
        <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, var(--primary), var(--accent))",
              boxShadow: "0 0 8px var(--primary)",
              transition: "width 0.5s linear",
            }}
          />
        </div>

        {/* Controls */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <IconBtn><Shuffle className="w-3.5 h-3.5" /></IconBtn>
            <IconBtn><SkipBack className="w-4 h-4" /></IconBtn>
            <button
              onClick={() => setPlaying((p) => !p)}
              className="w-10 h-10 rounded-full grid place-items-center text-black"
              style={{
                background: "linear-gradient(135deg, var(--primary), #ffb26b)",
                boxShadow: "var(--shadow-glow-primary)",
              }}
            >
              {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
            </button>
            <IconBtn><SkipForward className="w-4 h-4" /></IconBtn>
            <IconBtn><Repeat className="w-3.5 h-3.5" /></IconBtn>
          </div>
          <div className="flex items-center gap-1.5 text-white/60">
            <Volume2 className="w-3.5 h-3.5" />
            <div className="w-14 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-white/70" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children }: { children: React.ReactNode }) {
  return (
    <button className="w-7 h-7 rounded-full grid place-items-center text-white/70 hover:text-white hover:bg-white/5 transition">
      {children}
    </button>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
