"use client";

import { useRadio } from "./radio-context";

export default function RadioHistory() {
  const { history } = useRadio();

  if (history.length === 0) return null;

  return (
    <section className="section py-12 sm:py-16">
      <div className="flex flex-col gap-2 border-b border-ink/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="eyebrow">Recientemente sonaron</p>
          <h2 className="mt-1 font-display text-2xl font-bold uppercase tracking-normal sm:text-3xl">
            Historial de emisión
          </h2>
        </div>
        <span className="self-start text-[11px] font-semibold uppercase tracking-[0.14em] text-muted sm:self-auto sm:text-xs sm:normal-case sm:tracking-normal">
          Últimos 5 temas
        </span>
      </div>

      <div className="mt-6 divide-y divide-ink/10 border-b border-ink/10">
        {history.map((item) => {
          const timeFormatted = item.playedAt
            ? new Date(item.playedAt * 1000).toLocaleTimeString("es-AR", {
                hour: "2-digit",
                minute: "2-digit",
                hourCycle: "h23",
              })
            : null;

          const title = item.song.title || item.song.text;
          const artist = item.song.artist;

          return (
            <div key={item.id} className="group flex items-center justify-between gap-4 py-3.5 transition hover:bg-mist/40 px-2 sm:px-3">
              <div className="flex items-center gap-3 min-w-0">
                <MusicIcon className="h-4 w-4 shrink-0 text-muted transition group-hover:text-brand" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-ink/90">{title}</p>
                  {artist && <p className="truncate text-xs text-muted">{artist}</p>}
                </div>
              </div>

              {timeFormatted && (
                <span className="shrink-0 rounded border border-ink/10 bg-canvas px-2 py-0.5 font-mono text-xs font-medium text-ink/60">
                  {timeFormatted} hs
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

function MusicIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}
