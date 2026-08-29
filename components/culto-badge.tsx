import { transmissionInfo } from "@/lib/data";
import type { TransmissionStatus } from "@/lib/youtube";

export default function CultoBadge({ status }: { status: TransmissionStatus }) {
  const isLive = status.kind === "live";
  const label =
    status.kind === "live"
      ? transmissionInfo.liveLabel
      : status.kind === "latest"
        ? transmissionInfo.latestLabel
        : transmissionInfo.unavailableLabel;

  return (
    <span
      className={`inline-flex items-center gap-2 border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
        isLive
          ? "border-brand/40 bg-brand/10 text-brand"
          : "border-ink/15 bg-ink/5 text-ink/60"
      }`}
    >
      <span className="relative flex h-2 w-2">
        {isLive && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            isLive ? "bg-brand" : "bg-ink/30"
          }`}
        />
      </span>
      {label}
    </span>
  );
}
