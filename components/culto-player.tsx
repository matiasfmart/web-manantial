"use client";

import { churchInfo } from "@/lib/data";

/**
 * Muestra el embed en vivo del culto por YouTube si ya se configuró el ID del
 * canal (churchInfo.youtubeChannelId). Mientras tanto, ofrece un acceso directo
 * a "/live", que YouTube redirige automáticamente a la transmisión en curso o,
 * si no hay ninguna, al último video del canal.
 */
export default function CultoPlayer({ compact = false }: { compact?: boolean }) {
  if (churchInfo.youtubeChannelId) {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl bg-surface2">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/live_stream?channel=${churchInfo.youtubeChannelId}`}
          title="Culto en vivo — Ministerio Manantial de Avivamiento"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <a
      href={`${churchInfo.social.youtube}/live`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-white/10 bg-surface2 text-center transition hover:bg-surface2/70 ${
        compact ? "gap-2" : ""
      }`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-light transition group-hover:scale-110">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span className="max-w-xs px-4 text-sm font-semibold text-white/70">
        Ver en vivo o la última reunión en YouTube
      </span>
    </a>
  );
}
