import { useEffect } from "react";

/**
 * Keep the screen awake while the dashboard is open.
 * Uses the Screen Wake Lock API where available (Chrome / Safari 16.4+).
 * Automatically re-acquires the lock after the tab is backgrounded.
 */
export function useWakeLock(enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    if (typeof navigator === "undefined") return;
    const anyNav = navigator as Navigator & {
      wakeLock?: { request: (t: "screen") => Promise<WakeLockSentinel> };
    };
    if (!anyNav.wakeLock) return;

    let sentinel: WakeLockSentinel | null = null;
    let cancelled = false;

    const acquire = async () => {
      try {
        sentinel = await anyNav.wakeLock!.request("screen");
        sentinel.addEventListener("release", () => {
          sentinel = null;
        });
      } catch {
        /* user gesture may be required; safe to ignore */
      }
    };

    const onVis = () => {
      if (document.visibilityState === "visible" && !sentinel && !cancelled) {
        void acquire();
      }
    };

    void acquire();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
      sentinel?.release().catch(() => {});
    };
  }, [enabled]);
}

interface WakeLockSentinel extends EventTarget {
  release: () => Promise<void>;
}
