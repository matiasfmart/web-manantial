"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";

type BankTransfer = {
  bank: string;
  holder: string;
  cbu: string;
  alias: string;
  cuit: string;
};

type CopyState = "idle" | "copied" | "error";

export default function BankTransferDetails({ details }: { details: BankTransfer }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
  }, []);

  const copy = async (field: string, value: string) => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
      } else if (!copyWithFallback(value)) {
        throw new Error("Clipboard unavailable");
      }
      setCopiedField(field);
      setCopyState("copied");
    } catch {
      if (copyWithFallback(value)) {
        setCopiedField(field);
        setCopyState("copied");
      } else {
        setCopiedField(field);
        setCopyState("error");
      }
    }

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setCopiedField(null);
      setCopyState("idle");
    }, 1800);
  };

  const rows = [
    { label: "Banco", value: details.bank },
    { label: "Titular", value: details.holder },
    { label: "CBU", value: details.cbu, emphasis: true },
    { label: "Alias", value: details.alias, emphasis: true },
    { label: "CUIT", value: details.cuit },
  ];

  return (
    <div className="divide-y divide-line border-y border-line text-sm">
      {rows.map((row) => {
        const copied = copiedField === row.label;
        const feedback = copied ? (copyState === "copied" ? "Copiado" : "Error") : "Copiar";

        return (
          <div key={row.label} className="group flex flex-col gap-2 px-0 py-3 transition-colors hover:bg-mist/60 sm:flex-row sm:items-center sm:justify-between sm:px-3">
            <span className="text-muted">{row.label}</span>
            <div className="flex min-w-0 items-center justify-between gap-3 sm:justify-end">
              <span className={`break-all text-right ${row.emphasis ? "font-bold text-ink" : "font-semibold text-carbon"}`}>
                {row.value}
              </span>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => copy(row.label, row.value)}
                className={`min-w-[72px] shrink-0 ${copied ? "border-brand/60 text-brand" : ""}`}
                aria-label={`Copiar ${row.label}`}
              >
                {feedback}
              </Button>
            </div>
          </div>
        );
      })}
      <p className="sr-only" aria-live="polite">
        {copiedField && copyState === "copied" ? `${copiedField} copiado.` : ""}
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
