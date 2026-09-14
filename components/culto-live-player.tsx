"use client";

import { useState } from "react";
import type { ChurchInfo } from "@/lib/data";
import { RadioPlayButton, RadioStatus, VolumeControl } from "./radio-controls";

export default function CultoLivePlayer({
  videoId,
  title,
  compact = false,
  churchInfo,
}: {
  videoId: string;
  title: string | null;
  compact?: boolean;
  churchInfo: ChurchInfo;
}) {
  const [mode, setMode] = useState<"video" | "audio">("video");
  const playerParams = compact ? "autoplay=1&mute=1&playsinline=1" : "autoplay=1";

  return (
    <div className="w-full space-y-3">
      {/* Selector de Modo: Video vs Solo Audio (Ahorro de datos) */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-white/70">
          Modo de transmisión:
        </span>
        <div className="inline-flex rounded-lg border border-white/20 bg-white/5 p-1 text-xs">
          <button
            type="button"
            onClick={() => setMode("video")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-semibold transition ${
              mode === "video"
                ? "bg-white text-ink shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <VideoIcon className="h-3.5 w-3.5" />
            <span>Video (YouTube)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("audio")}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1 font-semibold transition ${
              mode === "audio"
                ? "bg-brand text-white shadow-sm"
                : "text-white/70 hover:text-white"
            }`}
          >
            <RadioIcon className="h-3.5 w-3.5" />
            <span>Solo Audio (89.3 FM)</span>
          </button>
        </div>
      </div>

      {/* Contenido del Reproductor segun el modo seleccionado */}
      {mode === "video" ? (
        <div className="motion-scale-in aspect-video w-full overflow-hidden bg-ink shadow-lg">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${videoId}?${playerParams}`}
            title={title ?? "Transmisión en vivo — Ministerio Manantial de Avivamiento"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="motion-scale-in flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-brand/30 bg-gradient-to-br from-[#121a1c] to-[#1d2729] px-6 py-8 text-center text-white shadow-lg">
          <span className="rounded-full border border-brand-light/30 bg-brand-light/10 px-3 py-1 text-xs font-semibold text-brand-light">
            {churchInfo.radioDialFm} · Ahorro de datos móviles
          </span>

          <h4 className="mt-4 font-display text-2xl font-bold uppercase tracking-normal sm:text-3xl">
            {title || "Culto en vivo por Radio"}
          </h4>

          <p className="mt-2 max-w-sm text-xs text-white/60 sm:text-sm">
            Escuchá la transmisión oficial directamente desde el auditorio con la mejor calidad de audio.
          </p>

          <div className="mt-6 flex flex-col items-center gap-3">
            <RadioPlayButton tone="dark" size="lg" label="Escuchar Culto en Vivo" />
            <RadioStatus tone="dark" idleLabel="Presioná play para escuchar" />
          </div>

          <div className="mt-6">
            <VolumeControl />
          </div>
        </div>
      )}
    </div>
  );
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="23 7 16 12 23 17 23 7" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </svg>
  );
}

function RadioIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="2" />
      <path d="M16.24 7.76a6 6 0 0 1 0 8.49M7.76 16.24a6 6 0 0 1 0-8.49" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 19.07a10 10 0 0 1 0-14.14" />
    </svg>
  );
}
