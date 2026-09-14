"use client";

import { useEffect, useRef } from "react";
import { useRadio } from "./radio-context";
import type { RadioMood } from "@/lib/radio-schedule";

/** Barras que reaccionan al volumen real del stream (Web Audio API), no a una animación fija. */
export default function RadioAudioVisualizer({ mood }: { mood: RadioMood }) {
  const { isPlaying, getAnalyser } = useRadio();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isPlaying) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const barColor = mood === "night" ? "rgba(143, 211, 255, 0.16)" : "rgba(15, 76, 129, 0.14)";

    const resize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    let frameId: number;
    const draw = () => {
      const analyser = getAnalyser();
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      if (analyser) {
        const data = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(data);

        const gap = width / data.length;
        const barWidth = gap * 0.55;
        ctx.fillStyle = barColor;

        for (let i = 0; i < data.length; i++) {
          const level = data[i] / 255;
          const barHeight = Math.max(level * height, height * 0.03);
          const x = i * gap + (gap - barWidth) / 2;
          ctx.fillRect(x, height - barHeight, barWidth, barHeight);
        }
      }

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(frameId);
    };
  }, [isPlaying, getAnalyser, mood]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-40 w-full sm:h-56"
    />
  );
}
