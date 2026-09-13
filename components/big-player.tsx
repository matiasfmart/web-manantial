"use client";

import { useEffect, useState } from "react";
import type { ChurchInfo } from "@/lib/data";
import { getRadioMood, type RadioMood } from "@/lib/radio-schedule";
import { RadioPlayButton, RadioStatus, VolumeControl } from "./radio-controls";
import RadioAudioVisualizer from "./radio-audio-visualizer";

const MOOD_REFRESH_MS = 5 * 60_000;

export default function BigPlayer({ churchInfo }: { churchInfo: ChurchInfo }) {
  // Arranca en "day" (mismo primer render que el server) y se corrige apenas monta.
  const [mood, setMood] = useState<RadioMood>("day");

  useEffect(() => {
    const update = () => setMood(getRadioMood());
    update();
    const id = window.setInterval(update, MOOD_REFRESH_MS);
    return () => window.clearInterval(id);
  }, []);

  const isNight = mood === "night";

  return (
    <section
      className={`relative overflow-hidden py-20 transition-colors duration-700 sm:py-28 ${
        isNight ? "bg-ink text-white" : "bg-canvas text-ink"
      }`}
    >
      <RadioAudioVisualizer mood={mood} />

      <div className="section relative z-10 flex flex-col items-center text-center">
        <p className={`eyebrow ${isNight ? "!text-white/50" : ""}`}>
          {isNight ? "Sonando de noche" : "Sonando ahora"}
        </p>

        <div className="mt-8">
          <RadioPlayButton tone={isNight ? "dark" : "light"} size="xl" label="Escuchar Radio Maranata" />
        </div>

        <div className="mt-8">
          <RadioStatus tone={isNight ? "dark" : "light"} idleLabel="Presioná play para escuchar" />
        </div>

        <p className="mt-4 font-display font-display-emphasis text-4xl font-bold uppercase tracking-normal sm:text-6xl">
          {churchInfo.radioName}
        </p>
        <p className={`mt-3 max-w-md text-sm ${isNight ? "text-white/60" : "text-ink/60"}`}>
          {churchInfo.radioDialFm} · Transmisión oficial online las 24 horas, los 7 días de la semana.
        </p>

        <div className="mt-8">
          <VolumeControl />
        </div>
      </div>
    </section>
  );
}
