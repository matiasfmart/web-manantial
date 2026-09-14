import { NextResponse } from "next/server";
import { getAzuraCastNowPlaying } from "@/lib/azuracast";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAzuraCastNowPlaying();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
