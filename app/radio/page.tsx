import type { Metadata } from "next";
import { churchInfo, radioSchedule } from "@/lib/data";
import BigPlayer from "@/components/big-player";

export const metadata: Metadata = {
  title: "Radio en vivo",
  description:
    "Escuchá Radio Manantial en vivo, las 24 horas. Descargá también nuestra aplicación móvil para iOS y Android.",
};

export default function RadioPage() {
  return (
    <section className="section py-28">
      <p className="eyebrow">{churchInfo.radioName}</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
        La radio de tu iglesia, siempre encendida
      </h1>
      <p className="mt-6 max-w-2xl text-white/60">
        Alabanza, prédicas y contenido para toda la familia, transmitiendo en
        vivo las 24 horas desde nuestro auditorio en Villa Lugano.
      </p>

      <div className="mt-14">
        <BigPlayer />
      </div>

      {/* PROGRAMACION */}
      <div className="mt-20">
        <p className="eyebrow">Programación</p>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
          Así suena nuestro día
        </h2>
        <div className="mt-8 overflow-hidden rounded-2xl border border-white/10">
          {radioSchedule.map((item, i) => (
            <div
              key={i}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-6 py-5 last:border-0 odd:bg-surface2/60"
            >
              <span className="font-display text-lg text-brand-light">
                {item.time}
              </span>
              <span className="font-semibold text-white/90">{item.program}</span>
              <span className="text-sm text-white/40">{item.host}</span>
            </div>
          ))}
        </div>
      </div>

      {/* APPS */}
      <div id="apps" className="mt-20 scroll-mt-24 card p-10 sm:p-14">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Llevala a todos lados</p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
              Descargá la app de Radio Manantial
            </h2>
            <p className="mt-4 max-w-md text-white/60">
              Escuchá la radio desde tu celular, recibí notificaciones de
              programas en vivo y accedé a contenido exclusivo. Disponible
              para iOS y Android.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={churchInfo.appStore}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                 App Store
              </a>
              <a
                href={churchInfo.playStore}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                ▶ Google Play
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative flex h-72 w-40 items-center justify-center rounded-[2rem] border border-white/15 bg-gradient-to-b from-surface2 to-ink shadow-glow sm:h-80 sm:w-48">
              <div className="absolute top-3 h-1 w-10 rounded-full bg-white/20" />
              <span className="font-display text-4xl font-black text-brand-light">M</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
