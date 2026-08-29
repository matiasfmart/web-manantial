"use client";

import Link from "next/link";
import type { ChurchInfo } from "@/lib/data";
import { useRadio } from "./radio-context";

export default function RadioStrip({
  churchInfo,
  className = "",
  variant = "light",
}: {
  churchInfo: ChurchInfo;
  className?: string;
  variant?: "light" | "dark";
}) {
  const { isPlaying, isLoading, hasError, toggle } = useRadio();
  const isDark = variant === "dark";

  return (
    <div
      className={`relative overflow-hidden border-y ${
        isDark ? "border-white/15 bg-white/[0.04] text-white" : "border-ink/10 bg-surface/80"
      } ${className}`}
    >
      <div className={`absolute inset-y-0 left-0 w-1 ${isDark ? "bg-white/20" : "bg-ink/20"}`} />
      <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <button
            onClick={toggle}
            aria-label={isPlaying ? "Pausar Radio Maranata" : "Escuchar Radio Maranata"}
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition active:scale-95 ${
              isDark ? "bg-white text-ink hover:bg-white/85" : "bg-ink text-white hover:bg-carbon"
            }`}
          >
            {isLoading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            ) : isPlaying ? (
              <PauseIcon />
            ) : (
              <PlayIcon />
            )}
          </button>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-xl font-semibold tracking-normal">
                {churchInfo.radioName}
              </p>
              <span
                className={`inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${
                  isDark ? "text-white/65" : "text-ink/65"
                }`}
              >
                <span className="h-1.5 w-1.5 animate-pulseSlow rounded-full bg-brand" />
                En vivo 24 h
              </span>
              {isPlaying && (
                <span className="audio-bars flex h-4 items-end gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className={`h-full w-1 ${isDark ? "bg-white/70" : "bg-brand"}`} />
                  ))}
                </span>
              )}
            </div>
            <p className={`mt-1 text-sm ${isDark ? "text-white/60" : "text-ink/60"}`}>
              {hasError
                ? "No pudimos conectar con la radio. Probá nuevamente."
                : "Alabanza, palabra y compañía desde el auditorio."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:pl-6">
          <div className="hidden h-10 items-end gap-1 md:flex" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                className={`w-1.5 ${isDark ? "bg-white/30" : "bg-ink/25"}`}
                style={{ height: `${18 + ((i * 29) % 78)}%` }}
              />
            ))}
          </div>
          <Link
            href="/radio"
            className={`shrink-0 text-xs font-semibold underline underline-offset-4 ${
              isDark ? "text-white/70 hover:text-white" : "text-ink/70 hover:text-ink"
            }`}
          >
            Abrir radio →
          </Link>
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-5 w-5">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
