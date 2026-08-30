import type { Metadata } from "next";
import { getChurchInfo, getRadioSchedule } from "@/lib/data";
import BigPlayer from "@/components/big-player";
import { ExternalButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Radio en vivo",
  description:
    "Escuchá Radio Maranata en vivo, las 24 horas. Descargá también nuestra aplicación móvil para iOS y Android.",
};

export default async function RadioPage() {
  const [churchInfo, radioSchedule] = await Promise.all([getChurchInfo(), getRadioSchedule()]);

  return (
    <>
      <section className="section py-20 sm:py-24">
        <p className="eyebrow">{churchInfo.radioName}</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
          La radio de tu iglesia, siempre encendida
        </h1>
        <p className="mt-6 max-w-2xl text-ink/65">
          Alabanza, prédicas y contenido para toda la familia, transmitiendo en
          vivo las 24 horas desde nuestro auditorio en Villa Lugano.
        </p>

        <div className="mt-14">
          <BigPlayer churchInfo={churchInfo} />
        </div>
      </section>

      {/* PROGRAMACION (fondo claro para mejor lectura) */}
      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section">
          <p className="eyebrow">Programación</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
            Así suena nuestro día
          </h2>
          <div className="mt-8 overflow-hidden border border-ink/10" data-stagger>
            {radioSchedule.map((item, i) => (
              <div
                key={i}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-ink/10 px-6 py-5 transition-colors last:border-0 odd:bg-black/5 hover:bg-mist/70"
              >
                <span className="font-display text-lg text-ink">
                  {item.time}
                </span>
                <span className="font-semibold text-ink/90">{item.program}</span>
                <span className="text-sm text-ink/40">{item.host}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-16 sm:py-20">
        {/* APPS */}
        <div id="apps" className="scroll-mt-24 border-y border-ink/10 py-6 sm:py-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Llevala a todos lados</p>
              <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
                Descargá la app de {churchInfo.radioName}
              </h2>
              <p className="mt-4 max-w-md text-ink/65">
                Escuchá la radio desde tu celular, recibí notificaciones de
                programas en vivo y accedé a contenido exclusivo. Disponible
                para iOS y Android.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ExternalButtonLink
                  href={churchInfo.appStore}
                  variant="secondary"
                >
                   App Store
                </ExternalButtonLink>
                <ExternalButtonLink
                  href={churchInfo.playStore}
                  variant="secondary"
                >
                  ▶ Google Play
                </ExternalButtonLink>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="motion-float relative flex h-64 w-36 items-center justify-center border border-white/15 bg-gradient-to-b from-surface2 to-ink sm:h-72 sm:w-44">
                <div className="absolute top-3 h-1 w-10 bg-white/20" />
                <span className="font-display text-4xl font-semibold text-white">M</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

