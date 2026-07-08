import { useEffect, useState, useCallback } from "react";

/** Online/offline status — works on iOS Safari. */
export function useOnlineStatus() {
  const [online, setOnline] = useState<boolean>(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return online;
}

type IOSDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

/**
 * Device compass heading in degrees (0 = North, clockwise).
 * iOS requires an explicit user gesture to grant permission — call `enable()`
 * from a click/tap handler. Uses webkitCompassHeading when present.
 */
export function useDeviceHeading() {
  const [heading, setHeading] = useState<number | null>(null);
  const [permission, setPermission] = useState<"unknown" | "granted" | "denied" | "unsupported">(
    "unknown",
  );

  const attach = useCallback(() => {
    const handler = (e: DeviceOrientationEvent) => {
      // iOS Safari exposes true compass heading here
      const webkit = (e as DeviceOrientationEvent & { webkitCompassHeading?: number })
        .webkitCompassHeading;
      if (typeof webkit === "number") {
        setHeading(webkit);
        return;
      }
      if (typeof e.alpha === "number") {
        // alpha: 0 = device pointed north on most Androids; convert to compass
        setHeading((360 - e.alpha) % 360);
      }
    };
    // 'deviceorientationabsolute' is more reliable on Android when available
    const evt =
      "ondeviceorientationabsolute" in window ? "deviceorientationabsolute" : "deviceorientation";
    window.addEventListener(evt, handler as EventListener, true);
    return () => window.removeEventListener(evt, handler as EventListener, true);
  }, []);

  const enable = useCallback(async () => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      setPermission("unsupported");
      return;
    }
    const DOE = DeviceOrientationEvent as IOSDeviceOrientationEvent;
    if (typeof DOE.requestPermission === "function") {
      try {
        const res = await DOE.requestPermission();
        setPermission(res === "granted" ? "granted" : "denied");
        if (res === "granted") attach();
      } catch {
        setPermission("denied");
      }
    } else {
      setPermission("granted");
      attach();
    }
  }, [attach]);

  // Non-iOS browsers: attach on mount (no permission needed)
  useEffect(() => {
    if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) {
      setPermission("unsupported");
      return;
    }
    const DOE = DeviceOrientationEvent as IOSDeviceOrientationEvent;
    if (typeof DOE.requestPermission !== "function") {
      setPermission("granted");
      return attach();
    }
  }, [attach]);

  return { heading, permission, enable };
}
