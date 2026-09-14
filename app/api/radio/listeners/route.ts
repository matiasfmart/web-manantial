import { NextResponse } from "next/server";
import { getAzuraCastListeners } from "@/lib/azuracast";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAzuraCastListeners();
  return NextResponse.json(data, {
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
