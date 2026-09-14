"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ChurchInfo } from "@/lib/data";
import type { AzuraCastSong, AzuraCastListenersResponse } from "@/lib/azuracast";
import { useRadio } from "./radio-context";
import { AudioBars, RadioPlayButton, VolumeControl } from "./radio-controls";

export default function FloatingPlayer({ churchInfo }: { churchInfo: ChurchInfo }) {
  const { isPlaying, isLoading, hasError } = useRadio();
  const [currentSong, setCurrentSong] = useState<AzuraCastSong | null>(null);
  const [listenersData, setListenersData] = useState<AzuraCastListenersResponse | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const fetchNowPlaying = async () => {
      try {
        const res = await fetch("/api/radio/now-playing");
        if (res.ok) {
          const data = await res.json();
          if (data?.currentSong?.title || data?.currentSong?.text) {
            setCurrentSong(data.currentSong);
          }
        }
      } catch {
        // Silencioso
      }
    };

    const fetchListeners = async () => {
      try {
        const res = await fetch("/api/radio/listeners");
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.totalListeners === "number") {
            setListenersData(data);
          }
        }
      } catch {
        // Silencioso
      }
    };

    fetchNowPlaying();
    fetchListeners();

    const intervalNowPlaying = setInterval(fetchNowPlaying, 15_000);
    const intervalListeners = setInterval(fetchListeners, 30_000);

    return () => {
      clearInterval(intervalNowPlaying);
      clearInterval(intervalListeners);
    };
  }, []);

  const status = hasError
    ? "No se pudo conectar"
    : isLoading
      ? "Conectando..."
      : isPlaying
        ? "En vivo"
        : "Radio online";

  const songTitle = currentSong?.title || currentSong?.text || null;
  const songArtist = currentSong?.artist || null;
  const songDisplay = songArtist ? `${songArtist} — ${songTitle}` : songTitle;

  const shareText = encodeURIComponent(
    `Estoy escuchando ${churchInfo.radioName} (${churchInfo.radioDialFm}) en vivo 📻: https://manantialdeavivamiento.com/radio`
  );

  return (
    <>
      {/* BARRA FIJA COMPACTA E ELEGANTE (Resting State) */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/15 bg-[#171a1b] shadow-2xl backdrop-blur-md">
        <div className={`absolute inset-y-0 left-0 w-1 transition-colors ${isPlaying ? "bg-brand-light" : "bg-brand"}`} />
        <div className="section flex items-center justify-between gap-3 py-2">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <RadioPlayButton tone="dark" size="sm" />

            <button
              type="button"
              onClick={() => setIsSheetOpen(true)}
              className="flex min-w-0 flex-1 flex-col text-left transition hover:opacity-90"
              aria-label="Abrir detalles del reproductor"
            >
              <div className="flex items-center gap-2">
                <span className="truncate font-display text-sm sm:text-base font-semibold leading-tight text-white">
                  {churchInfo.radioName}
                </span>
                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      hasError
                        ? "bg-red-400"
                        : isPlaying || isLoading
                          ? "animate-pulseSlow bg-brand-light"
                          : "bg-white/35"
                    }`}
                  />
                  {status}
                  {isPlaying && <AudioBars tone="dark" size="sm" />}
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs text-white/60">
                {hasError ? (
                  <span className="truncate text-red-300">Tocá play para reintentar.</span>
                ) : songDisplay ? (
                  <span className="inline-flex items-center gap-1.5 truncate">
                    <MusicNoteIcon className="h-3 w-3 shrink-0 text-brand-light" />
                    <span className="truncate font-medium text-white/80">{songDisplay}</span>
                  </span>
                ) : (
                  <span className="truncate font-medium">{churchInfo.radioDialFm} · Transmisión 24 h</span>
                )}
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0 border-l border-white/10 pl-3">
            <button
              type="button"
              onClick={() => setIsSheetOpen(true)}
              className="flex items-center gap-1 rounded border border-white/15 bg-white/5 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white/80 transition hover:border-white/30 hover:bg-white/10"
            >
              <MaximizeIcon className="h-3.5 w-3.5 text-brand-light" />
              <span className="hidden sm:inline">Detalles</span>
            </button>

            <Link
              href="/radio"
              className="hidden md:inline-block text-xs font-semibold uppercase tracking-wide text-white/60 hover:text-white"
            >
              Página de Radio →
            </Link>
          </div>
        </div>
      </div>

      {/* REPRODUCTOR DESPLEGABLE / BOTTOM SHEET (Drawer Estilo App Nativa) */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-[fadeIn_200ms_ease-out]">
          <div
            className="relative w-full max-w-lg rounded-t-3xl border-t border-white/20 bg-[#141718] p-6 text-white shadow-2xl animate-[slideUp_280ms_cubic-bezier(0.16,1,0.3,1)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Manija de arrastre / Cierre */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand-light animate-pulseSlow" />
                <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                  Reproductor de Radio
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsSheetOpen(false)}
                className="rounded-full border border-white/10 bg-white/5 p-1.5 text-white/70 transition hover:bg-white/15 hover:text-white"
                aria-label="Cerrar reproductor"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Cabecera Emisora */}
            <div className="mt-5 text-center">
              <span className="rounded-full border border-brand-light/30 bg-brand-light/10 px-3 py-1 text-xs font-semibold text-brand-light">
                {churchInfo.radioDialFm}
              </span>
              <h3 className="mt-3 font-display text-3xl font-black uppercase tracking-normal">
                {churchInfo.radioName}
              </h3>
            </div>

            {/* Ficha de Transmisión Al Aire */}
            <div className="mt-5 rounded-2xl border border-white/15 bg-white/[0.06] p-4 backdrop-blur-md">
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-widest text-white/50">
                <span className="inline-flex items-center gap-1.5 text-brand-light">
                  <SignalIcon className="h-3.5 w-3.5" />
                  Al aire ahora
                </span>
                <span className="font-mono rounded bg-white/10 px-2 py-0.5 text-[10px] text-white/70">
                  192 kbps HD
                </span>
              </div>

              <div className="mt-3 flex items-start gap-3">
                <MusicNoteIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-light" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display text-lg font-bold text-white">
                    {songTitle || "Transmisión en vivo las 24 horas"}
                  </p>
                  {songArtist && <p className="truncate text-xs font-medium text-white/60">{songArtist}</p>}
                </div>
              </div>

              {listenersData && listenersData.totalListeners > 0 && (
                <div className="mt-3 border-t border-white/10 pt-2.5 text-xs text-white/60">
                  <span className="font-semibold text-brand-light">
                    {listenersData.totalListeners} oyente{listenersData.totalListeners > 1 ? "s" : ""} online
                  </span>
                  {listenersData.locations.length > 0 && (
                    <span className="ml-1 text-white/50">
                      · desde {listenersData.locations.map((l) => (l.city ? `${l.city}, ${l.country}` : l.country)).slice(0, 3).join(" · ")}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Controles de Reproducción y Volumen */}
            <div className="mt-6 flex flex-col items-center gap-4">
              <RadioPlayButton tone="dark" size="lg" />
              <VolumeControl />
            </div>

            {/* Acciones Rápidas */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5">
              <a
                href={`https://wa.me/?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 py-2.5 text-xs font-semibold text-white transition hover:bg-white/15"
              >
                <ShareIcon className="h-4 w-4 text-brand-light" />
                Compartir por WA
              </a>

              <Link
                href="/radio"
                onClick={() => setIsSheetOpen(false)}
                className="flex items-center justify-center gap-2 rounded-xl border border-brand/40 bg-brand/20 py-2.5 text-xs font-semibold text-white transition hover:bg-brand/40"
              >
                Página de Radio →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function MaximizeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
    </svg>
  );
}

function SignalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2 20h.01M7 20v-4M12 20v-8M17 20v-12M22 20V4" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
    </svg>
  );
}
