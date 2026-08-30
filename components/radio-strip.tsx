"use client";

import Link from "next/link";
import type { ChurchInfo } from "@/lib/data";
import type { RadioScheduleItem } from "@/lib/radio-schedule";
import { RadioPlayButton, RadioStatus } from "./radio-controls";
import { useRadio } from "./radio-context";

export default function RadioStrip({
  churchInfo,
  currentProgram,
  className = "",
  variant = "light",
}: {
  churchInfo: ChurchInfo;
  currentProgram?: RadioScheduleItem | null;
  className?: string;
  variant?: "light" | "dark";
}) {
  const { isPlaying, isLoading, hasError } = useRadio();
  const isDark = variant === "dark";
  const helperText = hasError
    ? "No pudimos conectar la señal. Probá nuevamente."
    : isLoading
      ? `Conectando con ${churchInfo.radioName}...`
      : isPlaying
        ? "La señal continúa mientras recorrés el sitio."
        : "Música, palabra y compañía para acompañarte donde estés.";

  return (
    <div
      className={`relative overflow-hidden border-y ${
        isDark ? "border-white/15 bg-white/[0.04] text-white" : "border-ink/10 bg-surface/80"
      } ${className}`}
    >
      <div className={`absolute inset-y-0 left-0 w-1 transition-colors ${isPlaying ? "bg-brand-light" : "bg-brand"}`} />
      <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <RadioPlayButton tone={isDark ? "dark" : "light"} label="Escuchar Radio Maranata" />

          <div className="min-w-0">
            <p className={`text-[11px] font-semibold uppercase tracking-widest ${isDark ? "text-white/45" : "text-ink/45"}`}>
              Audio en vivo · 24 h
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-xl font-semibold tracking-normal">
                {churchInfo.radioName}
              </p>
              <RadioStatus tone={isDark ? "dark" : "light"} />
            </div>
            <p className={`mt-1 text-sm ${isDark ? "text-white/60" : "text-ink/60"}`}>
              {helperText}
            </p>
            <p className={`mt-3 text-xs font-semibold ${isDark ? "text-white/80" : "text-ink/75"}`}>
              {isPlaying ? "Pausar radio" : isLoading ? "Conectando señal" : "Escuchar ahora"}
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
          {currentProgram ? (
            <p className={`text-sm ${isDark ? "text-white/65" : "text-ink/65"}`}>
              <span className={`block text-[11px] font-semibold uppercase tracking-widest ${isDark ? "text-white/45" : "text-ink/45"}`}>Ahora en radio</span>
              <span className="mt-1 block font-medium">{currentProgram.program}</span>
            </p>
          ) : (
            <p className={`text-sm ${isDark ? "text-white/60" : "text-ink/60"}`}>Radio en vivo las 24 horas.</p>
          )}
          <Link
            href="/radio"
            className={`link-underline mt-3 inline-block text-xs font-semibold ${
              isDark ? "text-white/70 hover:text-white" : "text-ink/70 hover:text-ink"
            }`}
          >
            Ver programación →
          </Link>
        </div>
      </div>
    </div>
  );
}
