"use client";

import { useRadio } from "./radio-context";

type RadioTone = "light" | "dark";
type RadioPlaySize = "sm" | "md" | "lg";

const playButtonSize: Record<RadioPlaySize, string> = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-20 w-20 sm:h-24 sm:w-24",
};

const playIconSize: Record<RadioPlaySize, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-9 w-9",
};

export function RadioPlayButton({
  tone = "light",
  size = "md",
  label = "Escuchar radio en vivo",
}: {
  tone?: RadioTone;
  size?: RadioPlaySize;
  label?: string;
}) {
  const { isPlaying, isLoading, toggle } = useRadio();
  const isDark = tone === "dark";

  return (
    <button
      onClick={toggle}
      aria-label={isPlaying ? "Pausar radio" : label}
      className={`play-control ${isPlaying ? "is-playing" : ""} relative flex shrink-0 items-center justify-center rounded-full transition hover:scale-105 active:scale-95 ${playButtonSize[size]} ${
        isDark ? "bg-white text-ink hover:bg-white/85" : "bg-ink text-white hover:bg-carbon"
      }`}
    >
      <span className="relative z-10">
        {isLoading ? (
          <span
            className={`block animate-spin rounded-full border-2 ${
              isDark ? "h-4 w-4 border-ink/25 border-t-ink" : "h-5 w-5 border-white/30 border-t-white"
            }`}
          />
        ) : isPlaying ? (
          <PauseIcon className={playIconSize[size]} />
        ) : (
          <PlayIcon className={`${playIconSize[size]} ml-0.5`} />
        )}
      </span>
    </button>
  );
}

export function RadioStatus({
  tone = "light",
  idleLabel = "En vivo 24 h",
  showBars = true,
}: {
  tone?: RadioTone;
  idleLabel?: string;
  showBars?: boolean;
}) {
  const { isPlaying, isLoading, hasError } = useRadio();
  const isDark = tone === "dark";
  const label = hasError ? "No se pudo conectar" : isLoading ? "Conectando..." : isPlaying ? "En vivo ahora" : idleLabel;

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${
        hasError ? "text-red-400" : isDark ? "text-white/70" : "text-ink/65"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          hasError
            ? "bg-red-400"
            : isLoading
              ? "animate-pulseSlow bg-brand"
              : isPlaying
                ? "animate-pulseSlow bg-brand"
                : isDark
                  ? "bg-white/45"
                  : "bg-ink/35"
        }`}
      />
      {label}
      {showBars && isPlaying && <AudioBars tone={tone} size="sm" />}
    </span>
  );
}

export function AudioBars({
  tone = "light",
  size = "md",
}: {
  tone?: RadioTone;
  size?: "sm" | "md";
}) {
  const barClass = tone === "dark" ? "bg-white/70" : "bg-brand";
  const height = size === "sm" ? "h-3" : "h-4";
  const width = size === "sm" ? "w-0.5" : "w-1";

  return (
    <span className={`audio-bars inline-flex ${height} items-end gap-0.5`} aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className={`h-full ${width} ${barClass}`} />
      ))}
    </span>
  );
}

export function VolumeControl() {
  const { volume, setVolume } = useRadio();
  const percent = Math.round(volume * 100);

  return (
    <div className="flex items-center justify-center gap-3 sm:justify-start">
      <VolumeIcon level={volume} />
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(event) => setVolume(Number(event.target.value))}
        className="h-2 w-48 cursor-pointer appearance-none rounded-full accent-brand sm:w-44"
        style={{
          background: `linear-gradient(90deg, #4f6f78 ${percent}%, rgb(16 19 20 / 0.15) ${percent}%)`,
        }}
        aria-label="Volumen"
      />
    </div>
  );
}

function PlayIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}

function VolumeIcon({ level }: { level: number }) {
  if (level === 0) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-ink/50">
        <path d="M3 10v4h4l5 5V5L7 10H3z" />
        <path d="m17 9 4 6m0-6-4 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-ink/50">
      <path d="M3 10v4h4l5 5V5L7 10H3z" />
      {level > 0.35 && <path d="M16 8.5a5 5 0 0 1 0 7" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />}
      {level > 0.7 && <path d="M18.5 6a8 8 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />}
    </svg>
  );
}
