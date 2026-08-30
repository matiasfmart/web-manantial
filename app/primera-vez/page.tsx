import type { Metadata } from "next";
import { getChurchInfo, getFirstVisitItems, getGeneralServices } from "@/lib/data";
import { getTransmissionStatus } from "@/lib/youtube";
import { formatScheduleDate, getNextGeneralService } from "@/lib/schedule";
import { SocialBrandIcon } from "@/components/social-icons";
import FirstVisitAccordion from "@/components/first-visit-accordion";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { InteractiveLink } from "@/components/ui/interactive-link";

export const metadata: Metadata = {
  title: "Primera vez",
  description:
    "¿Es tu primera vez en Ministerio Manantial de Avivamiento? Conocé qué esperar, cómo llegar y todo lo que necesitás saber antes de tu visita.",
};

export default async function PrimeraVezPage() {
  const [churchInfo, firstVisitItems, generalServices] = await Promise.all([
    getChurchInfo(),
    getFirstVisitItems(),
    getGeneralServices(),
  ]);
  const nextGeneralService = getNextGeneralService(
    generalServices.filter((service) => service.location !== "homes")
  );
  const transmissionStatus = churchInfo.youtubeChannelId
    ? await getTransmissionStatus(churchInfo.youtubeChannelId)
    : ({ kind: "unavailable" } as const);
  const firstVisitWhatsappLink = `${churchInfo.prayerRequest.whatsappLink}?text=${encodeURIComponent(churchInfo.firstVisit.whatsappMessage)}`;

  return (
    <>
      <section className="section py-20 sm:py-24">
        <p className="eyebrow">Bienvenido a casa</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
          ¿Es tu primera vez?
        </h1>
        <p className="mt-6 max-w-2xl text-ink/65">
          {churchInfo.firstVisit.intro}
        </p>

        {nextGeneralService && (
          <div className="mt-10 border-y border-ink/15 bg-mist px-5 py-6 sm:px-8">
            <p className="eyebrow">Tu próxima oportunidad para conocernos</p>
            <time className="mt-4 block font-display text-3xl font-bold text-ink sm:text-4xl">
              {formatScheduleDate(nextGeneralService.date, nextGeneralService.service.time)}
            </time>
            <p className="mt-2 font-display text-xl font-semibold text-carbon">{nextGeneralService.service.label}</p>
            <p className="mt-2 text-sm text-copy">{churchInfo.auditoriumName}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ExternalButtonLink href={`https://maps.google.com/?q=${encodeURIComponent(churchInfo.mapsQuery)}`}>
                Cómo llegar
              </ExternalButtonLink>
              <ButtonLink href="/reuniones" variant="secondary">Ver horarios</ButtonLink>
            </div>
          </div>
        )}
      </section>

      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section">
          <p className="eyebrow">Qué esperar al venir</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
            Lo importante, sin vueltas
          </h2>
          <div className="mt-8 grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {churchInfo.firstVisit.arrivalSteps.map((step, index) => (
              <div key={step} className="py-5 sm:px-5 sm:py-0">
                <span className="font-display text-lg font-bold text-brand-dark">0{index + 1}</span>
                <p className="mt-2 text-sm font-medium leading-relaxed text-carbon">{step}</p>
              </div>
            ))}
          </div>

          <p className="eyebrow mt-12">Preguntas frecuentes</p>
          <FirstVisitAccordion items={firstVisitItems} />
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm">
            <InteractiveLink href="/ministerios/escuela-biblica" className="text-brand-dark">Conocé Escuela Bíblica</InteractiveLink>
            <InteractiveLink href="/ministerios/avivamiento-jovenes" className="text-brand-dark">Conocé Avivamiento Jóvenes</InteractiveLink>
          </div>
        </div>
      </section>

      <section className="section py-16 sm:py-20">
        <div className="flex flex-col items-start gap-4 border-y border-ink/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">¿Preferís mirar antes de venir?</p>
            <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
              Conocé una reunión desde casa
            </h2>
            <p className="mt-2 max-w-lg text-sm text-ink/65">
              Mirá la última transmisión disponible o acompañanos cuando estemos en vivo.
            </p>
          </div>
          <ButtonLink href="/en-vivo" variant={transmissionStatus.kind === "live" ? "onair" : "secondary"} className="shrink-0">
            Ver una reunión
          </ButtonLink>
        </div>

        <div className="mt-10 border-y border-ink/10 py-6">
          <p className="eyebrow">¿Tenés dudas?</p>
          <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
            ¿Todavía tenés una consulta?
          </h2>
          <p className="mt-2 max-w-lg text-sm text-ink/65">
            Contanos cualquier duda antes de tu visita: dónde estacionar, cómo
            llegar en colectivo, o lo que necesites.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <ExternalButtonLink
              href={firstVisitWhatsappLink}
              size="sm"
            >
              <SocialBrandIcon platform="whatsapp" />
              Escribir por WhatsApp
            </ExternalButtonLink>
            <ButtonLink href="/contacto?topic=Primera%20visita" variant="secondary" size="sm">
              Ir a Contacto
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

