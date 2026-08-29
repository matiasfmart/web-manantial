"use client";

import Link from "next/link";
import type { ChurchInfo } from "@/lib/data";
import { useRadio } from "./radio-context";

export default function RadioStrip({
  churchInfo,
  className = "",
}: {
  churchInfo: ChurchInfo;
  className?: string;
}) {
  const { isPlaying, isLoading, hasError, toggle } = useRadio();

  return (
    <div
      className={`relative overflow-hidden border-y border-white/10 bg-surface/80 ${className}`}
    >
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-brand to-gold" />
      <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <button
            onClick={toggle}
            aria-label={isPlaying ? "Pausar Radio Maranata" : "Escuchar Radio Maranata"}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white transition hover:bg-brand-light active:scale-95"
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
              <p className="font-display text-xl font-bold uppercase tracking-normal">
                {churchInfo.radioName}
              </p>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-light">
                <span className="h-1.5 w-1.5 animate-pulseSlow rounded-full bg-brand-light" />
                En vivo 24 h
              </span>
            </div>
            <p className="mt-1 text-sm text-white/50">
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
                className="w-1.5 bg-gradient-to-t from-brand to-gold opacity-75"
                style={{ height: `${18 + ((i * 29) % 78)}%` }}
              />
            ))}
          </div>
          <Link href="/radio" className="shrink-0 text-xs font-bold uppercase tracking-wide text-white/70 hover:text-white">
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
