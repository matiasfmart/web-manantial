"use client";

import Link from "next/link";
import { useRadio } from "./radio-context";
import type { ChurchInfo } from "@/lib/data";

export default function FloatingPlayer({ churchInfo }: { churchInfo: ChurchInfo }) {
  const { isPlaying, isLoading, hasError, toggle } = useRadio();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 translate-y-full border-t border-white/15 bg-[#171a1b] animate-[revealUp_520ms_cubic-bezier(0.22,1,0.36,1)_450ms_forwards]">
      <div className="section flex items-center justify-between gap-3 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <button
            onClick={toggle}
            aria-label={isPlaying ? "Pausar radio" : "Escuchar radio en vivo"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-ink transition hover:bg-white/85 active:scale-95"
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
            <p className="flex items-center gap-2 truncate text-base font-semibold leading-tight text-white">
              {churchInfo.radioName}
              {isPlaying && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">
                  <span className="h-1.5 w-1.5 animate-pulseSlow rounded-full bg-white/70" />
                  En vivo
                  <span className="audio-bars ml-1 hidden h-3 items-end gap-0.5 sm:flex" aria-hidden="true">
                    {Array.from({ length: 4 }).map((_, index) => (
                      <span key={index} className="h-full w-0.5 bg-white/60" />
                    ))}
                  </span>
                </span>
              )}
            </p>
            <p className="hidden truncate text-xs text-white/50 sm:block">
              {hasError
                ? "No se pudo conectar. Probá de nuevo."
                : "Escuchá la radio de la iglesia online"}
            </p>
          </div>
        </div>
        <Link
          href="/radio"
          className="hidden shrink-0 border-l border-white/10 pl-4 text-xs font-semibold uppercase tracking-wide text-white/70 hover:text-white sm:block"
        >
          Abrir radio →
        </Link>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
      <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
    </svg>
  );
}
