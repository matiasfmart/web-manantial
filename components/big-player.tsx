"use client";

import type { ChurchInfo } from "@/lib/data";
import { RadioPlayButton, RadioStatus, VolumeControl } from "./radio-controls";

export default function BigPlayer({ churchInfo }: { churchInfo: ChurchInfo }) {
  return (
    <div className="relative overflow-hidden border-y border-ink/10 py-6 sm:py-8">
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:text-left">
        <RadioPlayButton size="lg" label="Escuchar Radio Maranata" />

        <div className="flex-1">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <RadioStatus idleLabel="Presioná play para escuchar" />
          </div>
          <p className="mt-3 font-display font-display-emphasis text-3xl font-bold uppercase tracking-normal sm:text-4xl">
            {churchInfo.radioName}
          </p>
          <p className="mt-2 text-sm text-ink/60">
            Transmisión oficial online las 24 horas, los 7 días de la semana.
          </p>
          <div className="mt-6"><VolumeControl /></div>
        </div>
      </div>
    </div>
  );
}
