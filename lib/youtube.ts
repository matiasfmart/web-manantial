export type TransmissionStatus =
  | { kind: "live"; videoId: string; title: string | null }
  | { kind: "latest"; videoId: string; title: string | null; publishedAt: string | null }
  | { kind: "unavailable" };

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
      { next: { revalidate: 300 } }
    );

    if (feedRes.ok) {
      const xml = await feedRes.text();
      const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[1] ?? null;
      const videoId = entry?.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? null;
      const title = decodeXml(entry?.match(/<media:title>(.*?)<\/media:title>/)?.[1] ?? null);
      const publishedAt = entry?.match(/<published>(.*?)<\/published>/)?.[1] ?? null;

      if (videoId) {
        if (await isLiveVideo(videoId)) {
          return { kind: "live", videoId, title };
        }

        if (await isEmbeddableVideo(videoId)) {
          return { kind: "latest", videoId, title, publishedAt };
        }
      }
    }
  } catch (err) {
    console.error("[YouTube] RSS feed error:", err);
  }

  return { kind: "unavailable" };
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