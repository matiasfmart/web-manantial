"use client";

import {
  createContext,
  useCallback,
  useContext,
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

export function RadioProvider({
  streamUrl,
  children,
}: {
  streamUrl: string;
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [volume, setVolumeState] = useState(0.85);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);
    audio
      .play()
      .then(() => {
        setIsPlaying(true);
        setIsLoading(false);
      })
      .catch(() => {
        setHasError(true);
        setIsLoading(false);
        setIsPlaying(false);
      });
  }, [isPlaying]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const value = useMemo(
    () => ({ isPlaying, isLoading, hasError, toggle, volume, setVolume }),
    [isPlaying, isLoading, hasError, toggle, volume, setVolume]
  );

  return (
    <RadioContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        preload="none"
        src={streamUrl}
        onWaiting={() => setIsLoading(true)}
        onPlaying={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
          setIsLoading(false);
        }}
      />
    </RadioContext.Provider>
  );
}

export function useRadio() {
  const ctx = useContext(RadioContext);
  if (!ctx) throw new Error("useRadio must be used within RadioProvider");
  return ctx;
}
