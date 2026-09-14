"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { AzuraCastSong, AzuraCastHistoryItem, AzuraCastListenersResponse } from "@/lib/azuracast";

type RadioContextValue = {
  isPlaying: boolean;
  isLoading: boolean;
  hasError: boolean;
  toggle: () => void;
  volume: number;
  setVolume: (v: number) => void;
  getAnalyser: () => AnalyserNode | null;
  currentSong: AzuraCastSong | null;
  history: AzuraCastHistoryItem[];
  listenersData: AzuraCastListenersResponse | null;
};

const RadioContext = createContext<RadioContextValue | null>(null);

const MAX_AUTO_RETRIES = 2;
const RETRY_DELAY_MS = 2500;
const RADIO_POLL_INTERVAL_MS = 15000;

export function RadioProvider({
  streamUrl,
  stationName,
  children,
}: {
  streamUrl: string;
  stationName: string;
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolumeState] = useState(0.85);

  const [currentSong, setCurrentSong] = useState<AzuraCastSong | null>(null);
  const [history, setHistory] = useState<AzuraCastHistoryItem[]>([]);
  const [listenersData, setListenersData] = useState<AzuraCastListenersResponse | null>(null);

  // Un solo loop de sincronización global para toda la aplicación
  useEffect(() => {
    let isMounted = true;

    const fetchSyncData = async () => {
      try {
        const [nowPlayingRes, listenersRes] = await Promise.all([
          fetch("/api/radio/now-playing"),
          fetch("/api/radio/listeners"),
        ]);

        if (nowPlayingRes.ok && isMounted) {
          const npData = await nowPlayingRes.json();
          setCurrentSong(npData?.currentSong ?? null);
          if (Array.isArray(npData?.history)) {
            setHistory(npData.history);
          }
        }

        if (listenersRes.ok && isMounted) {
          const lData = await listenersRes.json();
          if (lData && typeof lData.totalListeners === "number") {
            setListenersData(lData);
          }
        }
      } catch {
        // Silencioso
      }
    };

    fetchSyncData();
    const interval = setInterval(fetchSyncData, RADIO_POLL_INTERVAL_MS);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      window.clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Conecta el <audio> a un AnalyserNode una sola vez, para poder visualizar la
  // señal real. Requiere gesto del usuario (se llama desde play()).
  const ensureAudioGraph = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || sourceNodeRef.current) return;

    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;

      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioContext.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceNodeRef.current = source;
    } catch (error) {
      console.error("[radio] No se pudo inicializar el analizador de audio:", error);
    }
  }, []);

  const getAnalyser = useCallback(() => analyserRef.current, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    ensureAudioGraph();
    audioContextRef.current?.resume().catch(() => {});

    setIsLoading(true);
    setHasError(false);
    audio.volume = volume;
    audio
      .play()
      .then(() => {
        retryCountRef.current = 0;
        setIsPlaying(true);
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
        setIsPlaying(false);
      });
  }, [volume]);

  const pause = useCallback(() => {
    clearRetryTimeout();
    retryCountRef.current = 0;
    audioRef.current?.pause();
    setIsPlaying(false);
  }, [clearRetryTimeout]);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, pause, play]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const value = useMemo(
    () => ({
      isPlaying,
      isLoading,
      hasError,
      toggle,
      volume,
      setVolume,
      getAnalyser,
      currentSong,
      history,
      listenersData,
    }),
    [isPlaying, isLoading, hasError, toggle, volume, setVolume, getAnalyser, currentSong, history, listenersData]
  );

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  useEffect(() => () => clearRetryTimeout(), [clearRetryTimeout]);

  // Reintenta reconectar la señal sola antes de pedirle al usuario que lo haga a mano.
  const handleAudioError = useCallback(() => {
    setIsPlaying(false);

    if (retryCountRef.current < MAX_AUTO_RETRIES) {
      retryCountRef.current += 1;
      setIsLoading(true);
      clearRetryTimeout();
      retryTimeoutRef.current = window.setTimeout(() => {
        audioRef.current?.play().catch(() => {
          setHasError(true);
          setIsLoading(false);
        });
      }, RETRY_DELAY_MS);
      return;
    }

    setHasError(true);
    setIsLoading(false);
  }, [clearRetryTimeout]);

  // Expone la radio a los controles del sistema (lock screen, notificaciones, auto).
  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

    const songTitle = currentSong?.title || currentSong?.text || stationName;
    const songArtist = currentSong?.artist ? currentSong.artist : stationName;

    const fallbackLogo =
      typeof window !== "undefined"
        ? `${window.location.origin}/logo/logo-color.png`
        : "https://manantialdeavivamiento.com/logo/logo-color.png";

    const artUrl = currentSong?.art || fallbackLogo;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: songTitle,
      artist: songArtist,
      album: stationName,
      artwork: [
        { src: artUrl, sizes: "512x512", type: "image/png" },
      ],
    });
    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
    };
  }, [stationName, currentSong, play, pause]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  return (
    <RadioContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="none"
        crossOrigin="anonymous"
        src={streamUrl}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => {
          retryCountRef.current = 0;
          setIsLoading(false);
          setIsPlaying(true);
        }}
        onPause={() => setIsPlaying(false)}
        onError={handleAudioError}
      />
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadio must be used within RadioProvider");
  return ctx;
}
