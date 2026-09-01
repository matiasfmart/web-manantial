export type TransmissionStatus =
  | { kind: "live"; videoId: string; title: string | null }
  | { kind: "latest"; videoId: string; title: string | null; publishedAt: string | null }
  | {
      kind: "unavailable";
      fallbackVideo?: { videoId: string; title: string | null; thumbnailUrl: string };
    };

type TransmissionDiagnostic =
  | "api-key-missing"
  | "live-found"
  | "latest-found"
  | "uploads-playlist-missing"
  | "no-videos"
  | `http-${number}`
  | "request-failed";

type YouTubeApiVideo = {
  id: string;
  title: string | null;
  publishedAt: string | null;
  thumbnailUrl: string;
  embeddable: boolean;
  actualStartTime?: string;
  actualEndTime?: string;
};

type TransmissionResult = {
  status: TransmissionStatus;
  diagnostic: TransmissionDiagnostic;
  liveVideoId: string | null;
};

export async function getTransmissionStatus(channelId: string): Promise<TransmissionStatus> {
  return (await getTransmissionFromYouTubeApi(channelId)).status;
}

export async function getTransmissionDiagnostic(channelId: string) {
  const result = await getTransmissionFromYouTubeApi(channelId);

  return {
    apiKeyConfigured: Boolean(process.env.YOUTUBE_API_KEY),
    officialLiveCheck: result.diagnostic,
    officialLiveVideoId: result.liveVideoId,
  };
}

async function getTransmissionFromYouTubeApi(channelId: string): Promise<TransmissionResult> {
  if (!process.env.YOUTUBE_API_KEY) {
    return {
      status: { kind: "unavailable" },
      diagnostic: "api-key-missing",
      liveVideoId: null,
    };
  }

  try {
    const uploadsPlaylistId = await getUploadsPlaylistId(channelId);
    if (!uploadsPlaylistId) {
      return {
        status: { kind: "unavailable" },
        diagnostic: "uploads-playlist-missing",
        liveVideoId: null,
      };
    }

    const videos = await getLatestUploads(uploadsPlaylistId);
    if (videos.length === 0) {
      return {
        status: { kind: "unavailable" },
        diagnostic: "no-videos",
        liveVideoId: null,
      };
    }

    const liveVideo = videos.find((video) => video.actualStartTime && !video.actualEndTime);
    if (liveVideo) {
      return {
        status: { kind: "live", videoId: liveVideo.id, title: liveVideo.title },
        diagnostic: "live-found",
        liveVideoId: liveVideo.id,
      };
    }

    const latestVideo = videos[0];
    if (latestVideo.embeddable) {
      return {
        status: {
          kind: "latest",
          videoId: latestVideo.id,
          title: latestVideo.title,
          publishedAt: latestVideo.publishedAt,
        },
        diagnostic: "latest-found",
        liveVideoId: null,
      };
    }

    return {
      status: {
        kind: "unavailable",
        fallbackVideo: {
          videoId: latestVideo.id,
          title: latestVideo.title,
          thumbnailUrl: latestVideo.thumbnailUrl,
        },
      },
      diagnostic: "latest-found",
      liveVideoId: null,
    };
  } catch (error) {
    if (error instanceof YouTubeApiError) {
      console.error("[YouTube] Data API responded", error.status);
      return {
        status: { kind: "unavailable" },
        diagnostic: `http-${error.status}`,
        liveVideoId: null,
      };
    }

    console.error("[YouTube] Data API error:", error);
    return {
      status: { kind: "unavailable" },
      diagnostic: "request-failed",
      liveVideoId: null,
    };
  }
}

async function getUploadsPlaylistId(channelId: string) {
  const data = await fetchYouTubeData<{
    items?: Array<{ contentDetails?: { relatedPlaylists?: { uploads?: string } } }>;
  }>("channels", {
    part: "contentDetails",
    id: channelId,
  });

  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
}

async function getLatestUploads(uploadsPlaylistId: string) {
  const playlistData = await fetchYouTubeData<{
    items?: Array<{ snippet?: { resourceId?: { videoId?: string } } }>;
  }>("playlistItems", {
    part: "snippet",
    playlistId: uploadsPlaylistId,
    maxResults: "5",
  });

  const videoIds = playlistData.items
    ?.map((item) => item.snippet?.resourceId?.videoId)
    .filter((videoId): videoId is string => Boolean(videoId)) ?? [];
  if (videoIds.length === 0) return [];

  const videoData = await fetchYouTubeData<{
    items?: Array<{
      id?: string;
      snippet?: {
        title?: string;
        publishedAt?: string;
        thumbnails?: { high?: { url?: string }; medium?: { url?: string }; default?: { url?: string } };
      };
      status?: { embeddable?: boolean };
      liveStreamingDetails?: { actualStartTime?: string; actualEndTime?: string };
    }>;
  }>("videos", {
    part: "snippet,status,liveStreamingDetails",
    id: videoIds.join(","),
  });

  const order = new Map(videoIds.map((videoId, index) => [videoId, index]));

  return (videoData.items ?? [])
    .filter((video): video is NonNullable<typeof videoData.items>[number] & { id: string } => Boolean(video.id))
    .map((video): YouTubeApiVideo => ({
      id: video.id,
      title: video.snippet?.title ?? null,
      publishedAt: video.snippet?.publishedAt ?? null,
      thumbnailUrl:
        video.snippet?.thumbnails?.high?.url ??
        video.snippet?.thumbnails?.medium?.url ??
        video.snippet?.thumbnails?.default?.url ??
        `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`,
      embeddable: video.status?.embeddable ?? false,
      actualStartTime: video.liveStreamingDetails?.actualStartTime,
      actualEndTime: video.liveStreamingDetails?.actualEndTime,
    }))
    .sort((left, right) => (order.get(left.id) ?? 0) - (order.get(right.id) ?? 0));
}

async function fetchYouTubeData<T>(resource: "channels" | "playlistItems" | "videos", params: Record<string, string>) {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("Missing YouTube API key");

  const searchParams = new URLSearchParams({ ...params, key: apiKey });
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/${resource}?${searchParams.toString()}`,
    { next: { revalidate: 60 } }
  );

  if (!response.ok) throw new YouTubeApiError(response.status);
  return await response.json() as T;
}

class YouTubeApiError extends Error {
  constructor(readonly status: number) {
    super(`YouTube Data API responded ${status}`);
  }
}