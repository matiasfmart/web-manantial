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
      <div className="motion-scale-in aspect-video w-full overflow-hidden bg-surface2">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube.com/embed/${transmissionStatus.videoId}`}
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

  return (
    <a
      href={`${churchInfo.social.youtube}/live`}
      target="_blank"
      rel="noopener noreferrer"
      className={`motion-scale-in group flex aspect-video w-full flex-col items-center justify-center gap-4 border border-ink/10 bg-surface2 px-6 text-center transition hover:border-brand/35 hover:bg-mist ${
        compact ? "gap-2" : ""
      }`}
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white transition duration-300 group-hover:scale-105 group-hover:bg-brand-dark">
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <span className="max-w-xs text-sm font-semibold text-ink">
        No hay una transmisión activa ahora
      </span>
      <span className="max-w-sm text-xs leading-relaxed text-copy">
        Podés abrir el canal para ver próximas emisiones o reuniones recientes.
      </span>
      <span className="link-underline text-xs font-semibold text-ink/70">
        Ir al canal →
      </span>
    </a>
  );
}