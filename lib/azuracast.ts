export type AzuraCastSong = {
  id: string;
  title: string;
  artist: string;
  text: string;
  art: string | null;
};

export type AzuraCastHistoryItem = {
  id: string;
  playedAt: number;
  song: AzuraCastSong;
};

export type AzuraCastNowPlaying = {
  isOnline: boolean;
  listenersCount: number;
  currentSong: AzuraCastSong | null;
  history: AzuraCastHistoryItem[];
};

export type ListenerLocation = {
  city: string;
  region: string;
  country: string;
  connectedTime: number;
};

export type AzuraCastListenersResponse = {
  totalListeners: number;
  locations: ListenerLocation[];
};

const AZURACAST_BASE_URL = "https://azuracast-dquna-u78781.vm.elestio.app";
const STATION_SHORTCODE = "maranata";

/** Formatea nombres de temas/archivos limpios para mostrar en UI. */
export function cleanSongText(rawText: string | undefined | null): string {
  if (!rawText) return "";

  let cleaned = rawText.trim();

  // Si tiene formato de nombre de archivo con guiones (ej. "cancion-con-letras")
  if (cleaned.includes("-") && !cleaned.includes(" ") && !cleaned.includes(" - ")) {
    cleaned = cleaned.replace(/-/g, " ");
  }

  // Quitar extensiones comunes de audio
  cleaned = cleaned.replace(/\.(mp3|aac|flac|wav|m4a)$/i, "");

  // Capitalizar la primera letra si quedó en minúscula
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  }

  return cleaned;
}

/** Obtiene la información pública de Now Playing (no requiere API Key). */
export async function getAzuraCastNowPlaying(): Promise<AzuraCastNowPlaying> {
  try {
    const res = await fetch(`${AZURACAST_BASE_URL}/api/nowplaying/${STATION_SHORTCODE}`, {
      next: { revalidate: 15 },
    });

    if (!res.ok) {
      return { isOnline: false, listenersCount: 0, currentSong: null, history: [] };
    }

    const data = await res.json();

    const isOnline = Boolean(data?.is_online);
    const listenersCount = Number(data?.listeners?.current ?? 0);

    const nowPlayingSong = data?.now_playing?.song;
    const isOffline =
      !isOnline ||
      nowPlayingSong?.title?.toLowerCase() === "station offline" ||
      nowPlayingSong?.text?.toLowerCase() === "station offline";

    const currentSong: AzuraCastSong | null =
      !isOffline && (nowPlayingSong?.title || nowPlayingSong?.text)
        ? {
            id: nowPlayingSong.id || "current",
            title: cleanSongText(nowPlayingSong.title),
            artist: cleanSongText(nowPlayingSong.artist),
            text: cleanSongText(nowPlayingSong.text),
            art: nowPlayingSong.art || null,
          }
        : null;

    const rawHistory = Array.isArray(data?.song_history) ? data.song_history : [];
    const history: AzuraCastHistoryItem[] = rawHistory
      .filter((item: any) => item?.song?.title || item?.song?.text)
      .slice(0, 5)
      .map((item: any) => ({
        id: String(item.sh_id || item.song.id),
        playedAt: Number(item.played_at || 0),
        song: {
          id: item.song.id || "",
          title: cleanSongText(item.song.title),
          artist: cleanSongText(item.song.artist),
          text: cleanSongText(item.song.text),
          art: item.song.art || null,
        },
      }));

    return {
      isOnline,
      listenersCount,
      currentSong,
      history,
    };
  } catch (error) {
    console.error("[AzuraCast] Error en nowplaying:", error);
    return { isOnline: false, listenersCount: 0, currentSong: null, history: [] };
  }
}

/** Obtiene las ubicaciones de oyentes activos (requiere AZURACAST_API_KEY). */
export async function getAzuraCastListeners(): Promise<AzuraCastListenersResponse> {
  const apiKey = process.env.AZURACAST_API_KEY;
  if (!apiKey) {
    return { totalListeners: 0, locations: [] };
  }

  try {
    const res = await fetch(`${AZURACAST_BASE_URL}/api/station/${STATION_SHORTCODE}/listeners`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      next: { revalidate: 30 },
    });

    if (!res.ok) {
      console.error("[AzuraCast] Error listeners response:", res.status);
      return { totalListeners: 0, locations: [] };
    }

    const data = await res.json();
    if (!Array.isArray(data)) {
      return { totalListeners: 0, locations: [] };
    }

    const locationsMap = new Map<string, ListenerLocation>();

    for (const listener of data) {
      if (!listener.location || listener.device?.is_bot) continue;

      const city = listener.location.city?.trim() || "";
      const region = listener.location.region?.trim() || "";
      const country = listener.location.country?.trim() || "";

      if (!city && !country) continue;

      const key = `${city}-${region}-${country}`;
      if (!locationsMap.has(key)) {
        locationsMap.set(key, {
          city,
          region,
          country,
          connectedTime: Number(listener.connected_time || 0),
        });
      }
    }

    return {
      totalListeners: data.length,
      locations: Array.from(locationsMap.values()),
    };
  } catch (error) {
    console.error("[AzuraCast] Error en listeners:", error);
    return { totalListeners: 0, locations: [] };
  }
}
