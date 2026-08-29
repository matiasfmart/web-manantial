import type { Metadata } from "next";
import Link from "next/link";
import { churchInfo, generalServices, specialServices } from "@/lib/data";

export const metadata: Metadata = {
  title: "Reuniones y horarios",
  description:
    "Conocé los horarios de reunión de la iglesia: reuniones generales, GDI, jóvenes, adolescentes, escuela bíblica y reuniones especiales.",
};

const days = ["Martes", "Miércoles", "Sábados", "Domingos"];

export default function ReunionesPage() {
  return (
    <section className="section py-28">
      <p className="eyebrow">Reuniones públicas</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
        Sumate a nuestras reuniones
      </h1>
      <p className="mt-6 max-w-2xl text-white/60">
        Todas nuestras reuniones generales se realizan en el{" "}
        {churchInfo.auditoriumName}, {churchInfo.address}. Los Grupos de
        Integración (GDI) también forman parte de nuestras reuniones
        generales, pero se organizan en distintos hogares — conocé más en la
        sección de{" "}
        <Link href="/ministerios/gdi" className="text-brand-light underline underline-offset-4">
          GDI
        </Link>
        .
      </p>

      <div className="mt-14 overflow-hidden rounded-2xl border border-white/10">
        {days.map((day) => {
          const items = generalServices.filter((s) => s.day === day);
          return (
            <div
              key={day}
              className="grid grid-cols-1 border-b border-white/10 last:border-0 sm:grid-cols-[180px_1fr]"
            >
              <div className="flex items-center bg-surface2 px-6 py-5 font-display text-2xl font-bold uppercase tracking-normal">
                {day}
              </div>
              <div className="divide-y divide-white/10">
                {items.map((s, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center justify-between gap-2 px-6 py-5"
                  >
                    <span className="flex items-center gap-2 font-medium text-white/80">
                      {s.label}
                      {s.streamed && (
                        <Link
                          href="/en-vivo"
                          className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-light"
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                          Se transmite por YouTube
                        </Link>
                      )}
                    </span>
                    <span className="font-display text-xl text-brand-light">
                      {s.time}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-16">
        <p className="eyebrow">Reuniones especiales fijas</p>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
          Momentos importantes del mes
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
          Además de nuestras reuniones semanales, cada mes tenemos espacios
          especiales de oración, consagración y comunión como iglesia.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {specialServices.map((service) => (
            <div key={service.name} className="card p-8">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-bold uppercase tracking-normal">
                  {service.name}
                </h3>
                {service.streamed && (
                  <Link
                    href="/en-vivo"
                    className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-gold-light"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                    Se transmite por YouTube
                  </Link>
                )}
              </div>
              <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-brand-light">
                {service.schedule}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-white/60">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 card p-8">
        <p className="eyebrow">Encuentros especiales</p>
        <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
          Algunas reuniones surgen durante el año
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
          También realizamos semanas de oración, invitados especiales, fines de
          semana ministeriales y otros encuentros fuera del calendario fijo. Si
          se transmiten, aparecen automáticamente en la sección En vivo desde
          nuestro canal de YouTube.
        </p>
        <Link href="/en-vivo" className="btn-secondary mt-6">
          Ir a En vivo
        </Link>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/primera-vez" className="group">
          <InfoCard
            title="¿Es tu primera vez? →"
            text="Vení tal cual estás. Contamos todo lo que necesitás saber antes de tu primera visita."
          />
        </Link>
        <InfoCard
          title="Niños y adolescentes"
          text="Durante las reuniones generales, los más chicos tienen su propio espacio en la Escuela Bíblica."
        />
        <InfoCard
          title="Grupos GDI"
          text="Se reúnen los miércoles 19:30 h en distintos hogares, organizados por edad y sexo. Contactanos para sumarte a uno cerca tuyo."
        />
      </div>
    </section>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="card p-6">
      <h3 className="font-display text-xl font-bold uppercase tracking-normal">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-white/60">{text}</p>
    </div>
  );
}
