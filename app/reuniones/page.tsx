import type { Metadata } from "next";
import Link from "next/link";
import { getChurchInfo, getGeneralServices, getSpecialServices } from "@/lib/data";
import { BadgeDot, BadgeLink } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";
import { InteractiveLink } from "@/components/ui/interactive-link";

export const metadata: Metadata = {
  title: "Reuniones y horarios",
  description:
    "Conocé los horarios de reunión de la iglesia: reuniones generales, GDI, jóvenes, adolescentes, escuela bíblica y reuniones especiales.",
};

const days = ["Martes", "Miércoles", "Sábados", "Domingos"];

export default async function ReunionesPage() {
  const [churchInfo, generalServices, specialServices] = await Promise.all([
    getChurchInfo(),
    getGeneralServices(),
    getSpecialServices(),
  ]);

  return (
    <>
      <section className="section py-20 sm:py-24">
        <p className="eyebrow">Reuniones públicas</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
          Sumate a nuestras reuniones
        </h1>
        <p className="mt-6 max-w-2xl text-ink/65">
          Todas nuestras reuniones generales se realizan en el{" "}
          {churchInfo.auditoriumName}, {churchInfo.address}. Los Grupos de
          Integración (GDI) también forman parte de nuestras reuniones
          generales, pero se organizan en distintos hogares — conocé más en la
          sección de{" "}
          <InteractiveLink href="/ministerios/gdi" className="text-brand">
            GDI
          </InteractiveLink>
          .
        </p>
      </section>

      {/* HORARIOS (fondo claro para mejor lectura) */}
      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section">
          <div className="overflow-hidden border border-ink/10" data-stagger>
            {days.map((day) => {
              const items = generalServices.filter((s) => s.day === day);
              return (
                <div
                  key={day}
                  className="grid grid-cols-1 border-b border-ink/10 last:border-0 sm:grid-cols-[180px_1fr]"
                >
                  <div className="flex items-center bg-black/5 px-6 py-5 font-display text-2xl font-bold uppercase tracking-normal">
                    {day}
                  </div>
                  <div className="divide-y divide-ink/10">
                    {items.map((s, i) => (
                      <div
                        key={i}
                        className="flex flex-wrap items-center justify-between gap-2 px-6 py-5"
                      >
                        <span className="flex items-center gap-2 font-medium text-ink/80">
                          {s.label}
                          {s.streamed && (
                            <BadgeLink href="/en-vivo" variant="onair">
                              <BadgeDot tone="onair" pulse />
                              Se transmite por YouTube
                            </BadgeLink>
                          )}
                        </span>
                        <span className="font-display text-xl text-ink">
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
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink/60">
              Además de nuestras reuniones semanales, cada mes tenemos espacios
              especiales de oración, consagración y comunión como iglesia.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2" data-stagger>
              {specialServices.map((service) => (
                <div key={service.name} className="border-t border-ink/10 pt-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-2xl font-bold uppercase tracking-normal">
                      {service.name}
                    </h3>
                    {service.streamed && (
                      <BadgeLink href="/en-vivo" variant="onair">
                        <BadgeDot tone="onair" pulse />
                        Se transmite por YouTube
                      </BadgeLink>
                    )}
                  </div>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-ink/65">
                    {service.schedule}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink/60">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section py-16 sm:py-20">
        <div className="border-y border-ink/10 py-6">
          <p className="eyebrow">Encuentros especiales</p>
          <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
            Algunas reuniones surgen durante el año
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
            También realizamos semanas de oración, invitados especiales, fines de
            semana ministeriales y otros encuentros fuera del calendario fijo. Si
            se transmiten, aparecen automáticamente en la sección En vivo desde
            nuestro canal de YouTube.
          </p>
          <ButtonLink href="/en-vivo" variant="secondary" className="mt-6">
            Ir a En vivo
          </ButtonLink>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
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
    </>
  );
}

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-ink/15 pt-5">
      <h3 className="font-display text-xl font-bold uppercase tracking-normal">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink/65">{text}</p>
    </div>
  );
}
