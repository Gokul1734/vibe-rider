import { useEffect, useRef } from "react";

let ctx: AudioContext | null = null;
function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AC) return null;
  if (!ctx) ctx = new AC();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

/** Short beep at a given frequency (Hz) and duration (ms). */
export function beep(freq = 880, ms = 180, gain = 0.15) {
  const c = getCtx();
  if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sine";
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g).connect(c.destination);
  const now = c.currentTime;
  g.gain.setValueAtTime(gain, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + ms / 1000);
  osc.start(now);
  osc.stop(now + ms / 1000 + 0.02);
}

/**
 * Fire a beep the moment `speed` crosses an upward threshold.
 * Silent on downward crossings.
 */
export function useSpeedBeep(speed: number, thresholds: number[] = [50, 100]) {
  const prev = useRef<number>(0);
  useEffect(() => {
    const p = prev.current;
    for (const t of thresholds) {
      if (p < t && speed >= t) {
        // higher pitch for higher threshold
        beep(t >= 100 ? 1200 : 880, t >= 100 ? 260 : 180);
      }
    }
    prev.current = speed;
  }, [speed, thresholds]);
}

/** Prime the audio context on first user gesture (required by iOS). */
export function primeAudio() {
  getCtx();
}
