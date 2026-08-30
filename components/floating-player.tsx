"use client";

import Link from "next/link";
import type { ChurchInfo } from "@/lib/data";
import { useRadio } from "./radio-context";
import { AudioBars, RadioPlayButton } from "./radio-controls";
import { InteractiveLink } from "./ui/interactive-link";

export default function FloatingPlayer({ churchInfo }: { churchInfo: ChurchInfo }) {
  const { isPlaying, isLoading, hasError } = useRadio();

  const status = hasError
    ? "No se pudo conectar"
    : isLoading
      ? "Conectando..."
      : isPlaying
        ? "En vivo"
        : "Radio online";

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 translate-y-full border-t border-white/15 bg-[#171a1b] animate-[revealUp_520ms_cubic-bezier(0.22,1,0.36,1)_450ms_forwards]">
      <div className="section flex items-center justify-between gap-3 py-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <RadioPlayButton tone="dark" size="sm" />
          <div className="min-w-0">
            <Link
              href="/radio"
              className="flex items-center gap-2 truncate text-base font-semibold leading-tight text-white transition hover:text-white/80"
            >
              {churchInfo.radioName}
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    hasError
                      ? "bg-red-400"
                      : isPlaying || isLoading
                        ? "animate-pulseSlow bg-white/70"
                        : "bg-white/35"
                  }`}
                />
                {status}
                {isPlaying && <AudioBars tone="dark" size="sm" />}
              </span>
            </Link>
            <p className="hidden truncate text-xs text-white/50 sm:block">
              {hasError ? "Tocá play para reintentar." : "Escuchá la radio de la iglesia online"}
            </p>
          </div>
        </div>
        <InteractiveLink
          href="/radio"
          className="shrink-0 border-l border-white/10 pl-4 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:text-white"
        >
          Abrir radio →
        </InteractiveLink>
      </div>
    </div>
  );
}
