"use client";

import { churchInfo } from "@/lib/data";
import { useRadio } from "./radio-context";

export default function BigPlayer() {
  const { isPlaying, isLoading, hasError, toggle, volume, setVolume } = useRadio();

  return (
    <div className="card relative overflow-hidden p-8 sm:p-12">
      <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/30 blur-[100px]" />
      <div className="absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-gold/20 blur-[100px]" />

      <div className="relative flex flex-col items-center gap-8 text-center sm:flex-row sm:text-left">
        <button
          onClick={toggle}
          aria-label={isPlaying ? "Pausar" : "Reproducir"}
          className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-brand-dark text-white shadow-glow transition hover:scale-105 active:scale-95"
        >
          {isLoading ? (
            <span className="h-7 w-7 animate-spin rounded-full border-4 border-white/30 border-t-white" />
          ) : isPlaying ? (
            <PauseIcon />
          ) : (
            <PlayIcon />
          )}
        </button>

        <div className="flex-1">
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <span
              className={`h-2 w-2 rounded-full ${
                isPlaying ? "animate-pulseSlow bg-brand-light" : "bg-white/30"
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-widest text-brand-light">
              {isPlaying ? "En vivo ahora" : "Presioná play para escuchar"}
            </span>
          </div>
          <p className="mt-3 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
            {churchInfo.radioName}
          </p>
          <p className="mt-2 text-sm text-white/50">
            Transmisión oficial online las 24 horas, los 7 días de la semana.
          </p>
          {hasError && (
            <p className="mt-3 text-sm text-red-400">
              No pudimos conectar con la transmisión. Verificá tu conexión e
              intentá nuevamente.
            </p>
          )}

          <div className="mt-6 flex items-center justify-center gap-3 sm:justify-start">
            <VolumeIcon />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="h-1.5 w-40 cursor-pointer appearance-none rounded-full bg-white/15 accent-brand"
              aria-label="Volumen"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-9 w-9">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-9 w-9">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-white/50">
      <path d="M3 10v4h4l5 5V5L7 10H3z" />
    </svg>
  );
}
