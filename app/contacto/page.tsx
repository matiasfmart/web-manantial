import type { Metadata } from "next";
import { getChurchInfo } from "@/lib/data";
import ContactForm from "@/components/contact-form";
import { SocialBrandIcon } from "@/components/social-icons";
import { AnchorButtonLink, ExternalButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactate con Ministerio Manantial de Avivamiento en Villa Lugano, CABA. Escribinos o visitanos en nuestro auditorio.",
};

export default async function ContactoPage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string; ministry?: string }>;
}) {
  const churchInfo = await getChurchInfo();
  const query = await searchParams;
  const hasPhone = Boolean(churchInfo.phone && churchInfo.phone !== "-");
  const hasEmail = Boolean(churchInfo.email && churchInfo.email !== "-");

  return (
    <>
      <section className="section py-20 sm:py-24">
        <p className="eyebrow">Estamos para vos</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
          Hablemos
        </h1>
        <p className="mt-6 max-w-2xl text-ink/65">
          Estamos para acompañarte, responder tus consultas y ayudarte a dar el próximo paso.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <ExternalButtonLink href={churchInfo.prayerRequest.whatsappLink}>
            <SocialBrandIcon platform="whatsapp" />
            Escribinos por WhatsApp
          </ExternalButtonLink>
          <ExternalButtonLink
            href={`https://maps.google.com/?q=${encodeURIComponent(churchInfo.mapsQuery)}`}
            variant="secondary"
          >
            Cómo llegar
          </ExternalButtonLink>
        </div>
      </section>

      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section max-w-3xl">
          <p className="eyebrow">Contacto institucional</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal sm:text-4xl">
            Escribinos
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-copy">
            Dejanos tu mensaje y el equipo correspondiente va a poder responderte mejor.
          </p>
          <ContactForm
            variant="light"
            whatsappLink={churchInfo.prayerRequest.whatsappLink}
            initialTopic={query.topic}
            ministry={query.ministry}
          />
        </div>
      </section>

      <section className="bg-mist py-16 text-ink sm:py-20">
        <div className="section flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="eyebrow">Pedido de oración</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal sm:text-4xl">
              ¿Necesitás oración?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-copy">
              {churchInfo.prayerRequest.intro}
            </p>
          </div>
          <ExternalButtonLink href={churchInfo.prayerRequest.whatsappLink} className="shrink-0">
            <SocialBrandIcon platform="whatsapp" />
            Escribir por WhatsApp
          </ExternalButtonLink>
        </div>
      </section>

      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section">
          <p className="eyebrow">Visitá el auditorio</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal sm:text-4xl">
            {churchInfo.auditoriumName}
          </h2>
          <p className="mt-4 text-copy">{churchInfo.address}</p>
          <p className="mt-2 text-sm italic text-muted">{churchInfo.historicNote}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ExternalButtonLink href={`https://maps.google.com/?q=${encodeURIComponent(churchInfo.mapsQuery)}`}>
              Cómo llegar
            </ExternalButtonLink>
            {hasPhone && (
              <AnchorButtonLink href={`tel:${churchInfo.phone.replace(/\s/g, "")}`} variant="secondary">
                Llamar
              </AnchorButtonLink>
            )}
            {hasEmail && (
              <AnchorButtonLink href={`mailto:${churchInfo.email}`} variant="secondary">
                Escribir por email
              </AnchorButtonLink>
            )}
          </div>

          <div className="mt-10 overflow-hidden border border-ink/10">
            <iframe
              title="Mapa del auditorio"
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(churchInfo.mapsQuery)}&output=embed`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
