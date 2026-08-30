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

export default async function RadioPage() {
  const [churchInfo, radioSchedule] = await Promise.all([getChurchInfo(), getRadioSchedule()]);
  const currentDay = getBuenosAiresRadioDay();
  const currentProgram = getCurrentRadioProgram(radioSchedule);

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

