import { transmissionInfo } from "@/lib/data";
import type { TransmissionStatus } from "@/lib/youtube";
import { Badge, BadgeDot } from "./ui/badge";

export default function CultoBadge({
  status,
  tone = "light",
}: {
  status: TransmissionStatus;
  tone?: "light" | "dark";
}) {
  const isLive = status.kind === "live";
  const label =
    status.kind === "live"
      ? transmissionInfo.liveLabel
      : status.kind === "latest"
        ? transmissionInfo.latestLabel
        : transmissionInfo.unavailableLabel;

  return (
    <Badge variant={isLive ? (tone === "dark" ? "onair-dark" : "onair") : "neutral"}>
      <BadgeDot tone={isLive ? "onair" : "neutral"} pulse={isLive} />
      {label}
    </Badge>
  );
}
