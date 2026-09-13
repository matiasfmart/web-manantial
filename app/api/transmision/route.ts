import { NextResponse } from "next/server";
import { getChurchInfo } from "@/lib/data";
import { getTransmissionDiagnostic, getTransmissionStatus } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const churchInfo = await getChurchInfo();
  const status = churchInfo.youtubeChannelId
    ? await getTransmissionStatus(churchInfo.youtubeChannelId)
    : { kind: "unavailable" as const };
  const debug = new URL(request.url).searchParams.get("debug") === "1";
  const diagnostic = debug && churchInfo.youtubeChannelId
    ? await getTransmissionDiagnostic(churchInfo.youtubeChannelId)
    : undefined;

  return NextResponse.json(debug ? { status, diagnostic } : status, {
    headers: { "Cache-Control": "no-store" },
  });
}