export type TransmissionStatus =
  | { kind: "live"; videoId: string; title: string | null }
  | { kind: "latest"; videoId: string; title: string | null; publishedAt: string | null }
  | {
      kind: "unavailable";
      fallbackVideo?: { videoId: string; title: string | null; thumbnailUrl: string };
    };

type OfficialLiveCheck = {
  status: Extract<TransmissionStatus, { kind: "live" }> | null;
  diagnostic: "api-key-missing" | "live-found" | "no-live-result" | `http-${number}` | "request-failed";
};

/**
 * Determina si el canal está transmitiendo ahora mismo y, si no,
 * devuelve el último video publicado.
 *
 * No requiere API key: intenta detectar el vivo desde la página pública del
 * canal y usa el RSS público para el último video. Si no confirma un video,
 * devuelve unavailable para no renderizar iframes rotos.
 */
export async function getTransmissionStatus(channelId: string): Promise<TransmissionStatus> {
  try {
    const liveRes = await fetch(`https://www.youtube.com/channel/${channelId}/live`, {
      headers: { "user-agent": "Mozilla/5.0" },
      cache: "no-store",
    });

    if (liveRes.ok) {
      const html = await liveRes.text();
      const liveVideoId = extractLiveVideoId(html);
      if (liveVideoId) {
        return {
          kind: "live",
          videoId: liveVideoId,
          title: extractTitle(html),
        };
      }
    }
  } catch (err) {
    console.error("[YouTube] live check error:", err);
  }

  try {
    const feedRes = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
      { next: { revalidate: 60 } }
    );

    if (feedRes.ok) {
      const xml = await feedRes.text();
      const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[1] ?? null;
      const videoId = entry?.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? null;
      const title = decodeXml(entry?.match(/<media:title>(.*?)<\/media:title>/)?.[1] ?? null);
      const publishedAt = entry?.match(/<published>(.*?)<\/published>/)?.[1] ?? null;

      if (videoId) {
        const officialLive = await getOfficialLiveTransmission(videoId, title);
        if (officialLive.status) return officialLive.status;

        if (await isLiveVideo(videoId)) {
          return { kind: "live", videoId, title };
        }

        if (await isEmbeddableVideo(videoId)) {
          return { kind: "latest", videoId, title, publishedAt };
        }

        return {
          kind: "unavailable",
          fallbackVideo: {
            videoId,
            title,
            thumbnailUrl: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
          },
        };
      }
    }
  } catch (err) {
    console.error("[YouTube] RSS feed error:", err);
  }

  return { kind: "unavailable" };
}

export async function getTransmissionDiagnostic(channelId: string) {
  const feedRes = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
    { cache: "no-store" }
  );
  const xml = feedRes.ok ? await feedRes.text() : "";
  const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[1] ?? null;
  const videoId = entry?.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? null;
  const title = decodeXml(entry?.match(/<media:title>(.*?)<\/media:title>/)?.[1] ?? null);
  const officialLive = videoId
    ? await getOfficialLiveTransmission(videoId, title)
    : { status: null, diagnostic: "no-live-result" } satisfies OfficialLiveCheck;

  return {
    apiKeyConfigured: Boolean(process.env.YOUTUBE_API_KEY),
    officialLiveCheck: officialLive.diagnostic,
    officialLiveVideoId: officialLive.status?.videoId ?? null,
  };
}

async function getOfficialLiveTransmission(videoId: string, title: string | null) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return { status: null, diagnostic: "api-key-missing" } satisfies OfficialLiveCheck;

  try {
    const params = new URLSearchParams({
      part: "liveStreamingDetails",
      id: videoId,
      key: apiKey,
    });
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?${params.toString()}`,
      { next: { revalidate: 60 } }
    );
    if (!response.ok) {
      console.error("[YouTube] official live check responded", response.status);
      return { status: null, diagnostic: `http-${response.status}` } satisfies OfficialLiveCheck;
    }

    const data = await response.json() as {
      items?: Array<{ liveStreamingDetails?: { actualStartTime?: string; actualEndTime?: string } }>;
    };
    const video = data.items?.[0];
    if (!video?.liveStreamingDetails?.actualStartTime || video.liveStreamingDetails.actualEndTime) {
      return { status: null, diagnostic: "no-live-result" } satisfies OfficialLiveCheck;
    }

    return {
      status: {
        kind: "live" as const,
        videoId,
        title,
      },
      diagnostic: "live-found",
    } satisfies OfficialLiveCheck;
  } catch (error) {
    console.error("[YouTube] official live check error:", error);
    return { status: null, diagnostic: "request-failed" } satisfies OfficialLiveCheck;
  }
}

function extractLiveVideoId(html: string) {
  const videoDetailsMatch = html.match(
    /"videoDetails":\{"videoId":"([^"]+)"[\s\S]{0,2000}?"isLive":true/
  );
  if (videoDetailsMatch?.[1]) return videoDetailsMatch[1];

  const liveIndex = html.indexOf('"isLiveNow":true');
  if (liveIndex === -1) return null;

  const nearby = html.slice(Math.max(0, liveIndex - 6000), liveIndex + 6000);
  return nearby.match(/"videoId":"([^"]+)"/)?.[1] ?? null;
}

function extractTitle(html: string) {
  const title = html.match(/<title>(.*?)<\/title>/)?.[1]?.replace(/ - YouTube$/, "") ?? null;
  return decodeXml(title);
}

async function isEmbeddableVideo(videoId: string) {
  try {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(
        `https://www.youtube.com/watch?v=${videoId}`
      )}&format=json`,
      { next: { revalidate: 300 } }
    );

    return res.ok;
  } catch {
    return false;
  }
}

async function isLiveVideo(videoId: string) {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: { "user-agent": "Mozilla/5.0" },
      cache: "no-store",
    });
    if (!response.ok) return false;

    const html = await response.text();
    const apiKey = html.match(/"INNERTUBE_API_KEY":"([^"]+)"/)?.[1];
    const clientVersion = html.match(/"INNERTUBE_CLIENT_VERSION":"([^"]+)"/)?.[1];
    if (apiKey && clientVersion) {
      const playerResponse = await fetch(
        `https://www.youtube.com/youtubei/v1/player?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "user-agent": "Mozilla/5.0",
          },
          body: JSON.stringify({
            videoId,
            context: { client: { clientName: "WEB", clientVersion } },
          }),
          cache: "no-store",
        }
      );
      if (playerResponse.ok) {
        const player = await playerResponse.json() as { videoDetails?: { isLiveContent?: boolean } };
        if (player.videoDetails?.isLiveContent) return true;
      }
    }

    const videoDetails = new RegExp(
      `"videoDetails":\\{"videoId":"${escapeRegExp(videoId)}"[\\s\\S]{0,2000}?"isLive":true`
    );
    return videoDetails.test(html);
  } catch {
    return false;
  }
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function decodeXml(value: string | null) {
  if (!value) return null;

  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}