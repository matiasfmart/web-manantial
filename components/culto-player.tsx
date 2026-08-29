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
    return (
      <div className="aspect-video w-full overflow-hidden bg-surface2">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${transmissionStatus.videoId}?autoplay=1`}
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
        <div className="aspect-video w-full overflow-hidden bg-surface2">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${transmissionStatus.videoId}`}
            title={transmissionStatus.title ?? "Última reunión en vivo"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
        <p className="px-1 text-sm text-white/60">
          Última reunión en vivo{fecha ? ` — ${fecha}` : ""}
        </p>
      </div>
    );
  }

  return (
    <a
      href={`${churchInfo.social.youtube}/live`}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex aspect-video w-full flex-col items-center justify-center gap-3 border border-white/10 bg-surface2 text-center transition hover:bg-surface2/70 ${
        compact ? "gap-2" : ""
      }`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-gold/15 text-gold-light transition group-hover:scale-110">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span className="max-w-xs px-4 text-sm font-semibold text-white/70">
        Ver el canal de YouTube
      </span>
      <span className="max-w-sm px-4 text-xs text-white/40">
        No pudimos confirmar una transmisión disponible en este momento.
      </span>
    </a>
  );
}