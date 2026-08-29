"use client";

import { useEffect, useState } from "react";

// Domingo 19:30 h (Argentina) con 10' de previa y 2 h de margen para el corte.
const START_MINUTE = 19 * 60 + 20;
const END_MINUTE = 21 * 60 + 30;

function computeIsLive() {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());

  const weekday = parts.find((p) => p.type === "weekday")?.value;
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const totalMinutes = hour * 60 + minute;

  return weekday === "Sun" && totalMinutes >= START_MINUTE && totalMinutes <= END_MINUTE;
}

/** Indica si el culto de los domingos está en su ventana de transmisión en vivo (hora de Buenos Aires). */
export function useLiveService() {
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    setIsLive(computeIsLive());
    const id = setInterval(() => setIsLive(computeIsLive()), 60_000);
    return () => clearInterval(id);
  }, []);

  return isLive;
}
