"use client";

import { churchInfo } from "@/lib/data";
import { useLiveService } from "./use-live-service";

export default function CultoBadge() {
  const isLive = useLiveService();

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${
        isLive
          ? "border-gold/50 bg-gold/10 text-gold-light"
          : "border-white/15 text-white/50"
      }`}
    >
      <span className="relative flex h-2 w-2">
        {isLive && (
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
        )}
        <span
          className={`relative inline-flex h-2 w-2 rounded-full ${
            isLive ? "bg-gold" : "bg-white/30"
          }`}
        />
      </span>
      {isLive ? "En vivo ahora" : churchInfo.liveServiceSchedule}
    </span>
  );
}
