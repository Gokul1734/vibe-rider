import { useEffect, useRef, useState, useCallback } from "react";

export type GpsPermission = "unknown" | "granted" | "denied" | "unsupported";

export interface GpsState {
  speed: number; // km/h
  tripKm: number;
  rideSeconds: number; // moving time
  avgSpeed: number; // km/h (moving avg)
  lat: number | null;
  lon: number | null;
  heading: number | null; // degrees from GPS course, if available
  permission: GpsPermission;
  active: boolean;
  error: string | null;
  enable: () => void;
  reset: () => void;
}

const STORAGE_KEY = "ridedeck.gps.v1";
const MOVING_THRESHOLD_KMH = 3; // ignore GPS jitter when stationary

function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

export function useGps(): GpsState {
  const [speed, setSpeed] = useState(0);
  const [tripKm, setTripKm] = useState(0);
  const [rideSeconds, setRideSeconds] = useState(0);
  const [lat, setLat] = useState<number | null>(null);
  const [lon, setLon] = useState<number | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [permission, setPermission] = useState<GpsPermission>("unknown");
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const watchId = useRef<number | null>(null);
  const lastPos = useRef<{ lat: number; lon: number; t: number } | null>(null);

  // Hydrate persisted trip/time
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const p = JSON.parse(raw);
        if (typeof p.tripKm === "number") setTripKm(p.tripKm);
        if (typeof p.rideSeconds === "number") setRideSeconds(p.rideSeconds);
      }
    } catch {
      /* noop */
    }
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setPermission("unsupported");
    }
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ tripKm, rideSeconds }));
    } catch {
      /* noop */
    }
  }, [tripKm, rideSeconds]);

  const handle = useCallback((pos: GeolocationPosition) => {
    setPermission("granted");
    setActive(true);
    setError(null);
    const { latitude, longitude, speed: gpsSpeed, heading: gpsHeading } = pos.coords;
    setLat(latitude);
    setLon(longitude);
    if (typeof gpsHeading === "number" && !Number.isNaN(gpsHeading)) setHeading(gpsHeading);

    const now = pos.timestamp || Date.now();
    let kmh = 0;
    if (typeof gpsSpeed === "number" && gpsSpeed >= 0 && !Number.isNaN(gpsSpeed)) {
      kmh = gpsSpeed * 3.6;
    } else if (lastPos.current) {
      const dtH = (now - lastPos.current.t) / 3_600_000;
      if (dtH > 0) {
        const d = haversineKm(lastPos.current, { lat: latitude, lon: longitude });
        kmh = d / dtH;
      }
    }
    setSpeed(kmh);

    if (lastPos.current) {
      const dtSec = (now - lastPos.current.t) / 1000;
      const d = haversineKm(lastPos.current, { lat: latitude, lon: longitude });
      // filter jitter: only accumulate when speed above threshold and dt reasonable
      if (kmh >= MOVING_THRESHOLD_KMH && dtSec > 0 && dtSec < 30 && d < 1) {
        setTripKm((v) => v + d);
        setRideSeconds((v) => v + dtSec);
      }
    }
    lastPos.current = { lat: latitude, lon: longitude, t: now };
  }, []);

  const enable = useCallback(() => {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setPermission("unsupported");
      return;
    }
    if (watchId.current !== null) return;
    watchId.current = navigator.geolocation.watchPosition(
      handle,
      (err) => {
        setError(err.message);
        if (err.code === err.PERMISSION_DENIED) setPermission("denied");
        setActive(false);
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15_000 },
    );
  }, [handle]);

  useEffect(() => {
    return () => {
      if (watchId.current !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, []);

  const reset = useCallback(() => {
    setTripKm(0);
    setRideSeconds(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
  }, []);

  const avgSpeed = rideSeconds > 0 ? (tripKm / (rideSeconds / 3600)) : 0;

  return {
    speed,
    tripKm,
    rideSeconds,
    avgSpeed,
    lat,
    lon,
    heading,
    permission,
    active,
    error,
    enable,
    reset,
  };
}

export function formatRideTime(sec: number) {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}
