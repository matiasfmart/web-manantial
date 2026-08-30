import type { Metadata } from "next";
import { getChurchInfo, getGeneralServices, getSpecialServices } from "@/lib/data";
import { Badge, BadgeDot, BadgeLink } from "@/components/ui/badge";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import WeeklySchedule from "@/components/weekly-schedule";
import { calendarUrl, formatScheduleDate, getNextGeneralService, getNextSpecialOccurrence, getServiceLocation } from "@/lib/schedule";

export const metadata: Metadata = {
  title: "Reuniones y horarios",
  description:
    "Conocé los horarios de reunión de la iglesia: reuniones generales, GDI, jóvenes, adolescentes, escuela bíblica y reuniones especiales.",
};

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function ReunionesPage() {
  const [churchInfo, generalServices, specialServices] = await Promise.all([
    getChurchInfo(),
    getGeneralServices(),
    getSpecialServices(),
  ]);
  const nextService = getNextGeneralService(generalServices);
  const specialServicesWithDate = specialServices.map((service) => ({
    service,
    occurrence: getNextSpecialOccurrence(service),
  }));

  return (
    <>
      <section className="section py-20 sm:py-24">
        <p className="eyebrow">Reuniones públicas</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
          Sumate a nuestras reuniones
        </h1>
        <p className="mt-6 max-w-2xl text-ink/65">
          Horarios, ubicación y formas de acompañarnos durante la semana.
        </p>

        {nextService && (
          <div className="mt-12 border-y border-ink/15 bg-mist px-5 py-6 sm:px-8 sm:py-8">
            <p className="eyebrow">Próxima reunión</p>
            <time className="mt-4 block font-display text-3xl font-bold text-ink sm:text-4xl">
              {formatScheduleDate(nextService.date, nextService.service.time)}
            </time>
            <p className="mt-2 font-display text-xl font-semibold text-carbon sm:text-2xl">
              {nextService.service.label}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-copy">
              <span>{getServiceLocation(nextService.service)}</span>
              {nextService.service.streamed && (
                <Badge variant="video">
                  <BadgeDot tone="brand" />
                  Disponible en YouTube
                </Badge>
              )}
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              {nextService.service.location === "homes" ? (
                <ButtonLink href="/ministerios/gdi" variant="primary">
                  Consultar por un GDI
                </ButtonLink>
              ) : (
                <ExternalButtonLink href={`https://maps.google.com/?q=${encodeURIComponent(churchInfo.mapsQuery)}`}>
                  Cómo llegar
                </ExternalButtonLink>
              )}
              {nextService.service.calendarEnabled !== false && (
                <ExternalButtonLink
                  href={calendarUrl({
                    title: nextService.service.calendarTitle || nextService.service.label,
                    date: nextService.date,
                    time: nextService.service.time,
                    location: getServiceLocation(nextService.service),
                    durationMinutes: nextService.service.calendarDurationMinutes,
                  })}
                  variant="secondary"
                >
                  Agendar
                </ExternalButtonLink>
              )}
              {nextService.service.streamed && (
                <ButtonLink href="/en-vivo" variant="secondary">
                  Ver transmisión
                </ButtonLink>
              )}
            </div>
          </div>
        )}
      </section>

      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section">
          <p className="eyebrow">Horario semanal</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal sm:text-4xl">
            Encontrá tu próximo espacio
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-copy">
            Reuniones generales en el auditorio y GDI durante la semana en hogares de la comunidad.
          </p>

          <div className="mt-8">
            <WeeklySchedule services={generalServices} initialDay={nextService?.service.day || "Domingos"} />
          </div>

          <div className="mt-10 border-y border-ink/10 py-6 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-semibold text-ink">Grupos GDI</p>
              <p className="mt-2 max-w-xl text-sm text-copy">Los miércoles nos reunimos en hogares, organizados por edad y sexo.</p>
            </div>
            <ButtonLink href="/ministerios/gdi" variant="secondary" className="mt-5 sm:mt-0">
              Encontrá un GDI
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-mist py-16 text-ink sm:py-20">
        <div className="section">
          <p className="eyebrow">Reuniones especiales</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal sm:text-4xl">
            Momentos importantes del mes
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-copy">
            Espacios mensuales de oración, consagración y comunión como iglesia.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2" data-stagger>
            {specialServicesWithDate.map(({ service, occurrence }) => {
              const date = occurrence?.date;
              const usesOverride = occurrence?.isOverride;
              const time = usesOverride ? service.nextTime || service.time : service.time;
              const streamed = usesOverride ? service.nextStreamed ?? service.streamed : service.streamed;

              return (
                <div key={service.name} className="border-t border-ink/15 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="font-display text-2xl font-semibold text-ink">{service.name}</h3>
                  {streamed && (
                    <BadgeLink href="/en-vivo" variant="video">
                      <BadgeDot tone="brand" />
                      YouTube
                    </BadgeLink>
                  )}
                </div>
                {date && <p className="mt-3 font-semibold text-carbon">Próxima: {formatScheduleDate(date, time)}</p>}
                <p className="mt-2 text-sm text-muted">{service.schedule}</p>
                {usesOverride && service.nextNote && <p className="mt-2 text-sm text-brand-dark">{service.nextNote}</p>}
                <p className="mt-4 text-sm leading-relaxed text-copy">{service.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {date && service.calendarEnabled !== false && (
                    <ExternalButtonLink
                      href={calendarUrl({
                        title: service.calendarTitle || service.name,
                        date,
                        time,
                        location: getServiceLocation(service),
                        durationMinutes: service.calendarDurationMinutes,
                      })}
                      variant="secondary"
                      size="sm"
                    >
                      Agendar
                    </ExternalButtonLink>
                  )}
                  {streamed && (
                    <ButtonLink href="/en-vivo" variant="secondary" size="sm">
                      Ver transmisión
                    </ButtonLink>
                  )}
                </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section py-16 sm:py-20">
        <div className="border-y border-ink/10 py-6">
          <p className="eyebrow">Encuentros especiales</p>
          <h2 className="mt-3 font-display text-2xl font-semibold tracking-normal">
            Novedades durante el año
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">
            Compartimos semanas de oración, invitados especiales y actividades fuera del calendario fijo.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ExternalButtonLink href={churchInfo.whatsappChannelUrl}>
              Recibir novedades por WhatsApp
            </ExternalButtonLink>
            <ButtonLink href="/en-vivo" variant="secondary">
              Ver transmisiones
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
