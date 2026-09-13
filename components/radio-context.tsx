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

type RadioContextValue = {
  isPlaying: boolean;
  isLoading: boolean;
  hasError: boolean;
  toggle: () => void;
  volume: number;
  setVolume: (v: number) => void;
};

const RadioContext = createContext<RadioContextValue | null>(null);

const MAX_AUTO_RETRIES = 2;
const RETRY_DELAY_MS = 2500;

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
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolumeState] = useState(0.85);

  const clearRetryTimeout = useCallback(() => {
    if (retryTimeoutRef.current) {
      window.clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

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
    () => ({ isPlaying, isLoading, hasError, toggle, volume, setVolume }),
    [isPlaying, isLoading, hasError, toggle, volume, setVolume]
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

    navigator.mediaSession.metadata = new MediaMetadata({
      title: stationName,
      artist: "En vivo · 24 h",
    });
    navigator.mediaSession.setActionHandler("play", play);
    navigator.mediaSession.setActionHandler("pause", pause);

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
    };
  }, [stationName, play, pause]);

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
