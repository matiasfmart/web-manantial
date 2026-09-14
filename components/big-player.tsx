"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { ChurchInfo } from "@/lib/data";
import type { ListenerLocation } from "@/lib/azuracast";
import { useRadio } from "./radio-context";
import { getRadioMood, type RadioMood } from "@/lib/radio-schedule";
import { RadioPlayButton, RadioStatus, VolumeControl } from "./radio-controls";
import RadioAudioVisualizer from "./radio-audio-visualizer";

const MOOD_REFRESH_MS = 5 * 60_000;

export default function BigPlayer({ churchInfo }: { churchInfo: ChurchInfo }) {
  const { currentSong, listenersData } = useRadio();
  const [mood, setMood] = useState<RadioMood>("day");

  useEffect(() => {
    const update = () => setMood(getRadioMood());
    update();
    const id = window.setInterval(update, MOOD_REFRESH_MS);
    return () => window.clearInterval(id);
  }, []);

  const isNight = mood === "night";

  const songTitle = currentSong?.title || currentSong?.text || null;
  const songArtist = currentSong?.artist || null;

  const shareText = encodeURIComponent(
    `Estoy escuchando ${churchInfo.radioName} (${churchInfo.radioDialFm}) en vivo 📻: https://manantialdeavivamiento.com/radio`
  );

  return (
    <section
      className={`relative overflow-hidden border-y border-ink/10 py-12 transition-colors duration-700 sm:py-16 ${
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

      <div className="section relative z-10">
        <div className="mx-auto max-w-2xl">
          <div className="flex flex-col justify-between">
            <div className="flex flex-wrap items-center justify-center gap-2 text-xs lg:justify-start">
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-semibold uppercase tracking-[0.16em] ${
                isNight ? "border-white/20 bg-white/10 text-white/80" : "border-ink/15 bg-white/80 text-ink/70"
              }`}>
                {isNight ? "Sonando de noche" : "Sonando ahora"}
              </span>

              {listenersData && listenersData.totalListeners > 0 && (
                <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-medium ${
                  isNight ? "border-white/20 bg-white/10 text-white/90" : "border-ink/15 bg-white/80 text-ink/80"
                }`}>
                  <GlobeIcon className="h-3.5 w-3.5" />
                  <span>
                    {listenersData.totalListeners} oyente{listenersData.totalListeners > 1 ? "s" : ""} online
                  </span>
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-col items-center gap-5 sm:flex-row sm:items-end lg:items-center lg:gap-6">
              <RadioPlayButton tone={isNight ? "dark" : "light"} size="xl" label="Escuchar Radio Maranata" />
              <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <RadioStatus tone={isNight ? "dark" : "light"} idleLabel="Presioná play para escuchar" />
                <h2 className="mt-2 font-display font-display-emphasis text-4xl font-black uppercase tracking-normal sm:text-5xl">
                  {churchInfo.radioName}
                </h2>
                <span className={`mt-1 text-xs font-semibold ${isNight ? "text-white/60" : "text-ink/60"}`}>
                  {churchInfo.radioDialFm} · Transmisión 24 h
                </span>
              </div>
            </div>

            <div className={`mt-6 rounded-[24px] border p-5 shadow-[0_18px_40px_rgba(0,0,0,0.04)] backdrop-blur-sm transition ${
              isNight ? "border-white/15 bg-white/[0.06] text-white" : "border-ink/10 bg-white/90 text-ink"
            }`}>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                <span className={`inline-flex items-center gap-1.5 ${isNight ? "text-white/80" : "text-ink/80"}`}>
                  <SignalIcon className="h-3.5 w-3.5 text-brand" />
                  Al aire ahora
                </span>
              </div>

              <div className="mt-3 flex items-start gap-3">
                <MusicNoteIcon className={`mt-0.5 h-5 w-5 shrink-0 ${isNight ? "text-white/60" : "text-ink/50"}`} />
                <div className="min-w-0 flex-1 overflow-hidden text-left">
                  {songTitle && songTitle.length > 32 ? (
                    <>
                      <p className="truncate font-display text-lg font-bold sm:hidden">
                        {songTitle}
                      </p>
                      <div className="marquee-mask hidden overflow-hidden whitespace-nowrap sm:block">
                        <div className="animate-marquee-scroll font-display text-xl font-bold">
                          <span className="pr-12">{songTitle}</span>
                          <span className="pr-12">{songTitle}</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="truncate font-display text-lg font-bold sm:text-xl">
                      {songTitle || "Transmisión en vivo las 24 horas"}
                    </p>
                  )}
                  {songArtist && (
                    <p className={`mt-0.5 truncate text-xs font-medium ${isNight ? "text-white/60" : "text-ink/60"}`}>
                      {songArtist}
                    </p>
                  )}
                </div>
              </div>

              {listenersData && listenersData.locations.length > 0 && (
                <p className={`mt-3 border-t pt-2.5 text-xs font-medium ${isNight ? "border-white/10 text-white/50" : "border-ink/10 text-ink/50"}`}>
                  Oyentes conectados desde: {listenersData.locations.map((l: ListenerLocation) => (l.city ? `${l.city}, ${l.country}` : l.country)).slice(0, 5).join(" · ")}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <VolumeControl />
              <a
                href={`https://wa.me/?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                  isNight
                    ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                    : "border-ink/15 bg-white text-ink hover:bg-mist"
                }`}
              >
                <ShareIcon className="h-3.5 w-3.5 text-brand" />
                Compartir señal por WA
              </a>
            </div>
          </div>
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
