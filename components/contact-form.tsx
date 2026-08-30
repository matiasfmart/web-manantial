"use client";

import { useState } from "react";
import { Button } from "./ui/button";

export default function ContactForm({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isLight = variant === "light";

  if (submitted) {
    return (
      <div className={`border-y py-8 text-center animate-[revealUp_520ms_cubic-bezier(0.22,1,0.36,1)_forwards] ${isLight ? "border-ink/10" : "border-white/10"}`}>
        <p className="font-display text-2xl font-bold uppercase text-ink">
          ¡Gracias por escribirnos!
        </p>
        <p className={`mt-3 text-sm ${isLight ? "text-ink/60" : "text-white/60"}`}>
          Recibimos tu mensaje y te vamos a contactar a la brevedad.
        </p>
      </div>
    );
  }

  const labelClass = `mb-2 block text-xs font-semibold uppercase tracking-wide ${
    isLight ? "text-ink/60" : "text-white/60"
  }`;
  const inputClass = `w-full border px-4 py-3 text-sm outline-none transition duration-200 focus:-translate-y-0.5 focus:border-brand focus:bg-white/95 ${
    isLight ? "border-ink/15 bg-white text-ink" : "border-white/15 bg-ink text-white focus:bg-white/5"
  }`;

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);
        setIsSending(true);

        const form = e.currentTarget;
        const data = new FormData(form);

        try {
          const res = await fetch("/api/contacto", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: data.get("name"),
              email: data.get("email"),
              message: data.get("message"),
            }),
          });

          if (!res.ok) {
            const body = await res.json().catch(() => null);
            throw new Error(body?.error || "No pudimos enviar tu mensaje.");
          }

          setSubmitted(true);
        } catch (err) {
          setError(err instanceof Error ? err.message : "No pudimos enviar tu mensaje.");
        } finally {
          setIsSending(false);
        }
      }}
      className={`space-y-5 border-y py-8 ${isLight ? "border-ink/10" : "border-white/10"}`}
    >
      <div>
        <label className={labelClass}>Nombre</label>
        <input required type="text" name="name" className={inputClass} placeholder="Tu nombre" />
      </div>
      <div>
        <label className={labelClass}>Email</label>
        <input required type="email" name="email" className={inputClass} placeholder="tu@email.com" />
      </div>
      <div>
        <label className={labelClass}>Mensaje</label>
        <textarea
          required
          name="message"
          rows={5}
          className={`resize-none ${inputClass}`}
          placeholder="¿En qué te podemos ayudar?"
        />
      </div>
      {error && <p className="animate-[revealUp_240ms_ease-out_forwards] text-sm text-red-400">{error}</p>}
      <Button type="submit" disabled={isSending} variant="primary" className="w-full disabled:opacity-60">
        {isSending ? (
          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white [animation-delay:240ms]" />
            Enviando
          </span>
        ) : (
          "Enviar mensaje"
        )}
      </Button>
    </form>
  );
}
