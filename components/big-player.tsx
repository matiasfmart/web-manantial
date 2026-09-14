"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ChurchInfo } from "@/lib/data";
import type { AzuraCastSong, AzuraCastListenersResponse } from "@/lib/azuracast";
import { getRadioMood, type RadioMood } from "@/lib/radio-schedule";
import { RadioPlayButton, RadioStatus, VolumeControl } from "./radio-controls";
import RadioAudioVisualizer from "./radio-audio-visualizer";

const MOOD_REFRESH_MS = 5 * 60_000;

export default function BigPlayer({ churchInfo }: { churchInfo: ChurchInfo }) {
  // Arranca en "day" (mismo primer render que el server) y se corrige apenas monta.
  const [mood, setMood] = useState<RadioMood>("day");
  const [currentSong, setCurrentSong] = useState<AzuraCastSong | null>(null);
  const [listenersData, setListenersData] = useState<AzuraCastListenersResponse | null>(null);

  useEffect(() => {
    const update = () => setMood(getRadioMood());
    update();
    const id = window.setInterval(update, MOOD_REFRESH_MS);
    return () => window.clearInterval(id);
  }, []);

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

    const intervalNowPlaying = setInterval(fetchNowPlaying, 20_000);
    const intervalListeners = setInterval(fetchListeners, 30_000);

    return () => {
      clearInterval(intervalNowPlaying);
      clearInterval(intervalListeners);
    };
  }, []);

  const isNight = mood === "night";

  const songTitle = currentSong?.title || currentSong?.text || null;
  const songArtist = currentSong?.artist || null;

  return (
    <section
      className={`relative overflow-hidden border-y border-ink/10 py-16 transition-colors duration-700 sm:py-24 ${
        isNight ? "bg-ink text-white" : "bg-canvas text-ink"
      }`}
    >
      {isNight && (
        <>
          <Image
            src="/images/radio/night.jpg"
            alt="Radio sonando de noche"
            fill
            sizes="100vw"
            className="hero-image-slow object-cover opacity-30 transition-opacity duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/65 to-ink/30" />
        </>
      )}

      <RadioAudioVisualizer mood={mood} />

      <div className="section relative z-10 flex flex-col items-center text-center">
        {/* Barra superior de Estado y Oyentes en Vivo */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold uppercase tracking-wider ${
            isNight ? "border-white/20 bg-white/10 text-white/80" : "border-ink/15 bg-white/80 text-ink/70"
          }`}>
            {isNight ? "Sonando de noche" : "Sonando ahora"}
          </span>

          {listenersData && listenersData.totalListeners > 0 && (
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium ${
              isNight ? "border-brand-light/30 bg-brand-light/10 text-brand-light" : "border-brand/25 bg-brand/10 text-brand-dark"
            }`}>
              <GlobeIcon className="h-3.5 w-3.5" />
              <span>
                {listenersData.totalListeners} oyente{listenersData.totalListeners > 1 ? "s" : ""} online
              </span>
            </span>
          )}
        </div>

        {/* Reproductor Central */}
        <div className="mt-8">
          <RadioPlayButton tone={isNight ? "dark" : "light"} size="xl" label="Escuchar Radio Maranata" />
        </div>

        <div className="mt-6">
          <RadioStatus tone={isNight ? "dark" : "light"} idleLabel="Presioná play para escuchar" />
        </div>

        {/* Título de la Emisora y Dial FM */}
        <h2 className="mt-4 font-display font-display-emphasis text-4xl font-black uppercase tracking-normal sm:text-6xl">
          {churchInfo.radioName}
        </h2>

        {/* Módulo "Al aire": Canción / Prédica Sonando Actualmente */}
        <div className={`mt-6 w-full max-w-xl rounded-2xl border p-5 shadow-sm backdrop-blur-sm transition ${
          isNight ? "border-white/15 bg-white/[0.06] text-white" : "border-ink/10 bg-white/90 text-ink"
        }`}>
          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted">
            <span className="inline-flex items-center gap-1.5 text-brand-light">
              <SignalIcon className="h-3.5 w-3.5" />
              Al aire
            </span>
            <span className="rounded bg-mist/60 px-2 py-0.5 text-[10px] text-ink/60 font-mono">192 kbps HD</span>
          </div>

          <div className="mt-3 flex items-start justify-center gap-3">
            <MusicNoteIcon className={`mt-0.5 h-5 w-5 shrink-0 ${isNight ? "text-brand-light" : "text-brand"}`} />
            <div className="min-w-0 flex-1 text-left">
              <p className="truncate font-display text-lg font-bold sm:text-xl">
                {songTitle || "Transmisión en vivo las 24 horas"}
              </p>
              {songArtist && (
                <p className={`mt-0.5 truncate text-xs font-medium ${isNight ? "text-white/60" : "text-ink/60"}`}>
                  {songArtist}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Ciudades de Oyentes Conectados */}
        {listenersData && listenersData.locations.length > 0 && (
          <p className={`mt-4 text-xs font-medium ${isNight ? "text-white/50" : "text-ink/50"}`}>
            Oyentes conectados desde: {listenersData.locations.map((l) => (l.city ? `${l.city}, ${l.country}` : l.country)).slice(0, 5).join(" · ")}
          </p>
        )}

        {/* Control de Volumen */}
        <div className="mt-8">
          <VolumeControl />
        </div>
      </div>
    </section>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
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

function MusicNoteIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
