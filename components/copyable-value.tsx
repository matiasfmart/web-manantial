"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

type CopyState = "idle" | "copied" | "error";

export default function CopyableValue({
  label,
  value,
  actionLabel = "Copiar",
  variant = "secondary",
}: {
  label: string;
  value: string;
  actionLabel?: string;
  variant?: "primary" | "secondary";
}) {
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else if (!copyWithFallback(value)) {
        throw new Error("Clipboard unavailable");
      }
      setCopyState("copied");
    } catch {
      setCopyState(copyWithFallback(value) ? "copied" : "error");
    }

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setCopyState("idle"), 1800);
  };

  const feedback = copyState === "copied" ? `${label} copiado` : copyState === "error" ? "No se pudo copiar" : actionLabel;

  return (
    <div className="border border-line bg-mist/40 p-4 text-sm">
      <span className="text-xs font-medium uppercase tracking-wide text-muted">{label}</span>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span className="break-all font-display text-2xl font-bold tracking-normal text-ink sm:text-3xl">
          {value}
        </span>
        <Button
          type="button"
          variant={variant}
          size="sm"
          onClick={copy}
          className={`shrink-0 ${copyState === "copied" && variant !== "primary" ? "border-brand/60 text-brand" : ""}`}
          aria-label={`Copiar ${label}`}
        >
          {feedback}
        </Button>
      </div>
      <p className={`mt-3 text-xs font-medium ${copyState === "idle" ? "sr-only" : copyState === "copied" ? "text-brand" : "text-onair"}`} aria-live="polite">
        {copyState === "copied" ? `${label} copiado al portapapeles.` : "No se pudo copiar. Seleccioná el dato manualmente."}
      </p>
    </div>
  );
}

function copyWithFallback(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand("copy");
  textarea.remove();
  return copied;
}