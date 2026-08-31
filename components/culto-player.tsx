import { getChurchInfo } from "@/lib/data";
import { getTransmissionStatus, type TransmissionStatus } from "@/lib/youtube";

/**
 * Muestra una transmisión confirmada; si YouTube no devuelve un video válido,
 * evita renderizar el iframe para no mostrar reproductores rotos.
 */
export default async function CultoPlayer({
  compact = false,
  status,
}: {
  compact?: boolean;
  status?: TransmissionStatus;
}) {
  const churchInfo = await getChurchInfo();
  const transmissionStatus =
    status ??
    (churchInfo.youtubeChannelId
      ? await getTransmissionStatus(churchInfo.youtubeChannelId)
      : { kind: "unavailable" as const });

  if (transmissionStatus.kind === "live") {
    const playerParams = compact ? "autoplay=1&mute=1&playsinline=1" : "autoplay=1";

    return (
      <div className="motion-scale-in aspect-video w-full overflow-hidden bg-surface2">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${transmissionStatus.videoId}?${playerParams}`}
          title={transmissionStatus.title ?? "Transmisión en vivo — Ministerio Manantial de Avivamiento"}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  if (transmissionStatus.kind === "latest") {
    const fecha = transmissionStatus.publishedAt
      ? new Date(transmissionStatus.publishedAt).toLocaleDateString("es-AR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : null;

    return (
      <div className={`w-full ${compact ? "space-y-1" : "space-y-2"}`}>
        <div className="motion-scale-in aspect-video w-full overflow-hidden bg-surface2">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${transmissionStatus.videoId}`}
            title={transmissionStatus.title ?? "Última reunión en vivo"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="px-1 text-sm text-ink/60">
          Última reunión en vivo{fecha ? ` — ${fecha}` : ""}
        </p>
      </div>
    );
  }

  const fallbackVideo = transmissionStatus.fallbackVideo;

  return (
    <a
      href={fallbackVideo ? `https://www.youtube.com/watch?v=${fallbackVideo.videoId}` : `${churchInfo.social.youtube}/live`}
      target="_blank"
      rel="noopener noreferrer"
      className={`motion-scale-in group relative flex aspect-video w-full flex-col items-center justify-center gap-4 overflow-hidden border border-ink/10 bg-surface2 px-6 text-center transition hover:border-brand/35 hover:bg-mist ${
        compact ? "gap-2" : ""
      }`}
    >
      {fallbackVideo && (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center opacity-30 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-40"
          style={{ backgroundImage: `url(${fallbackVideo.thumbnailUrl})` }}
        />
      )}
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white transition duration-300 group-hover:scale-105 group-hover:bg-brand-dark">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span className="relative max-w-xs text-sm font-semibold text-ink">
        {fallbackVideo?.title || "No hay una transmisión activa ahora"}
      </span>
      <span className="relative max-w-sm text-xs leading-relaxed text-copy">
        {fallbackVideo ? "Este video está disponible en YouTube." : "Podés abrir el canal para ver próximas emisiones o reuniones recientes."}
      </span>
      <span className="relative link-underline text-xs font-semibold text-ink/70">
        {fallbackVideo ? "Ver en YouTube →" : "Ir al canal →"}
      </span>
    </a>
  );
}