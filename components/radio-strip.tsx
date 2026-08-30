"use client";

import Link from "next/link";
import type { ChurchInfo } from "@/lib/data";
import { RadioPlayButton, RadioStatus } from "./radio-controls";
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
  const { isLoading, hasError } = useRadio();
  const isDark = variant === "dark";
  const helperText = hasError
    ? "No pudimos conectar. Tocá play para reintentar."
    : isLoading
      ? "Estamos conectando con la señal de la radio."
      : "Alabanza, palabra y compañía desde el auditorio.";

  return (
    <div
      className={`relative overflow-hidden border-y ${
        isDark ? "border-white/15 bg-white/[0.04] text-white" : "border-ink/10 bg-surface/80"
      } ${className}`}
    >
      <div className={`absolute inset-y-0 left-0 w-1 ${isDark ? "bg-white/20" : "bg-ink/20"}`} />
      <div className="flex flex-col gap-5 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex min-w-0 items-center gap-4">
          <RadioPlayButton tone={isDark ? "dark" : "light"} label="Escuchar Radio Maranata" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-display text-xl font-semibold tracking-normal">
                {churchInfo.radioName}
              </p>
              <RadioStatus tone={isDark ? "dark" : "light"} />
            </div>
            <p className={`mt-1 text-sm ${isDark ? "text-white/60" : "text-ink/60"}`}>
              {helperText}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:pl-6">
          <div className="hidden h-10 items-end gap-1 md:flex" aria-hidden="true">
            {Array.from({ length: 18 }).map((_, i) => (
              <span key={i} className={`w-1.5 ${isDark ? "bg-white/30" : "bg-ink/25"}`} style={{ height: `${18 + ((i * 29) % 78)}%` }} />
            ))}
          </div>
          <Link
            href="/radio"
            className={`link-underline shrink-0 text-xs font-semibold ${
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
