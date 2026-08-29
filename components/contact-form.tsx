"use client";

import { useState } from "react";

export default function ContactForm({ variant = "dark" }: { variant?: "dark" | "light" }) {
  const [submitted, setSubmitted] = useState(false);
  const isLight = variant === "light";

  if (submitted) {
    return (
      <div className={`border-y py-8 text-center ${isLight ? "border-ink/10" : "border-white/10"}`}>
        <p className="font-display text-2xl font-bold uppercase text-brand">
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
  const inputClass = `w-full border px-4 py-3 text-sm outline-none transition focus:border-brand ${
    isLight ? "border-ink/15 bg-white text-ink" : "border-white/15 bg-surface2"
  }`;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: conectar a un servicio de email o endpoint propio antes de producción
        setSubmitted(true);
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
      <button type="submit" className="btn-primary w-full">
        Enviar mensaje
      </button>
    </form>
  );
}
