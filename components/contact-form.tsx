"use client";

import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="border-y border-white/10 py-8 text-center">
        <p className="font-display text-2xl font-bold uppercase text-brand-light">
          ¡Gracias por escribirnos!
        </p>
        <p className="mt-3 text-sm text-white/60">
          Recibimos tu mensaje y te vamos a contactar a la brevedad.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        // TODO: conectar a un servicio de email o endpoint propio antes de producción
        setSubmitted(true);
      }}
      className="space-y-5 border-y border-white/10 py-8"
    >
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
          Nombre
        </label>
        <input
          required
          type="text"
          name="name"
          className="w-full border border-white/15 bg-surface2 px-4 py-3 text-sm outline-none transition focus:border-brand"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
          Email
        </label>
        <input
          required
          type="email"
          name="email"
          className="w-full border border-white/15 bg-surface2 px-4 py-3 text-sm outline-none transition focus:border-brand"
          placeholder="tu@email.com"
        />
      </div>
      <div>
        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-white/60">
          Mensaje
        </label>
        <textarea
          required
          name="message"
          rows={5}
          className="w-full resize-none border border-white/15 bg-surface2 px-4 py-3 text-sm outline-none transition focus:border-brand"
          placeholder="¿En qué te podemos ayudar?"
        />
      </div>
      <button type="submit" className="btn-primary w-full">
        Enviar mensaje
      </button>
    </form>
  );
}
