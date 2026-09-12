import type { Metadata } from "next";
import { getChurchInfo, getRadioSchedule } from "@/lib/data";
import { getBuenosAiresRadioDay, getCurrentRadioProgram } from "@/lib/radio-schedule";
import BigPlayer from "@/components/big-player";
import RadioScheduleTabs from "@/components/radio-schedule-tabs";

export const metadata: Metadata = {
  title: "Radio en vivo",
  description:
    "Escuchá Radio Maranata en vivo, las 24 horas, y conocé su programación semanal.",
};

const radioValues = [
  {
    name: "Alabanza",
    description: "Música que acompaña cada hora del día, con momentos de adoración en vivo.",
  },
  {
    name: "Palabra",
    description: "Prédicas y enseñanza bíblica para crecer en la fe donde estés.",
  },
  {
    name: "Comunidad",
    description: "La voz de nuestra iglesia, cerca de tu casa aunque no puedas venir.",
  },
  {
    name: "Testimonios",
    description: "Historias reales de personas que encontraron esperanza en Dios.",
  },
];

export default async function RadioPage() {
  const [churchInfo, radioSchedule] = await Promise.all([getChurchInfo(), getRadioSchedule()]);
  const currentDay = getBuenosAiresRadioDay();
  const currentProgram = getCurrentRadioProgram(radioSchedule);

  return (
    <>
      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="absolute inset-0 bg-hero-grid bg-[size:48px_48px] opacity-[0.12]" />
        <div className="absolute inset-0 bg-radial-fade" />

        <div className="section relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">{churchInfo.radioName}</p>
            <RadioWaveIcon />
          </div>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
            La radio de tu iglesia, siempre encendida
          </h1>
          <p className="mt-6 max-w-2xl text-ink/65">
            Alabanza, prédicas y contenido para toda la familia, transmitiendo en
            vivo las 24 horas desde nuestro auditorio en Villa Lugano.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink/70">
            <span>{churchInfo.radioDialFm}</span>
            <span className="text-ink/30">·</span>
            <span>Streaming online las 24 horas</span>
            <span className="text-ink/30">·</span>
            <span>El culto de los domingos se transmite en vivo también por acá</span>
          </div>

          <p className="mt-7 max-w-2xl border-l border-ink/15 pl-4 text-sm italic text-ink/50">
            &quot;Así que la fe es por el oír, y el oír, por la palabra de Dios.&quot; — Romanos 10:17
          </p>

          <div className="mt-10">
            <BigPlayer churchInfo={churchInfo} />
          </div>
        </div>
      </section>

      {/* PORQUE ESCUCHAR */}
      <section className="section py-16 sm:py-20">
        <p className="eyebrow">Por qué escuchar</p>
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" data-stagger>
          {radioValues.map((value) => (
            <div key={value.name} className="border-t border-ink/10 pt-5">
              <h3 className="font-display text-lg font-semibold tracking-normal text-ink">
                {value.name}
              </h3>
              <p className="mt-2 text-sm text-ink/65">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROGRAMACION (fondo claro para mejor lectura) */}
      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section">
          <p className="eyebrow">Programación</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
            Así suena nuestra semana
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-copy">
            Elegí un día para conocer la programación. El bloque marcado como Ahora corresponde al horario vigente en Buenos Aires.
          </p>
          <RadioScheduleTabs schedule={radioSchedule} initialDay={currentDay} currentProgram={currentProgram} />
        </div>
      </section>

    </>
  );
}

function RadioWaveIcon() {
  return (
    <span className="audio-bars inline-flex h-4 items-end gap-0.5 text-brand" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index} className="h-full w-1 bg-current" />
      ))}
    </span>
  );
}

