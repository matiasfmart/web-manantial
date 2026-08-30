import { NextResponse } from "next/server";
import { getChurchInfo } from "@/lib/data";
import { getTransmissionStatus } from "@/lib/youtube";

export const dynamic = "force-dynamic";

export async function GET() {
  const churchInfo = await getChurchInfo();
  const status = churchInfo.youtubeChannelId
    ? await getTransmissionStatus(churchInfo.youtubeChannelId)
    : { kind: "unavailable" as const };

  return NextResponse.json(status, {
    headers: { "Cache-Control": "no-store" },
  });
}