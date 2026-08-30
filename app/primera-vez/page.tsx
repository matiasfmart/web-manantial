import type { Metadata } from "next";
import Link from "next/link";
import { getChurchInfo } from "@/lib/data";
import { SocialBrandIcon } from "@/components/social-icons";
import FirstVisitAccordion from "@/components/first-visit-accordion";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Primera vez",
  description:
    "¿Es tu primera vez en Ministerio Manantial de Avivamiento? Conocé qué esperar, cómo llegar y todo lo que necesitás saber antes de tu visita.",
};

export default async function PrimeraVezPage() {
  const churchInfo = await getChurchInfo();
  const firstVisitItems = [
    {
      title: "¿Cuánto dura?",
      text: "Nuestras reuniones generales duran entre una hora y media y dos horas: alabanza, palabra y un momento de oración.",
    },
    {
      title: "¿Cómo me visto?",
      text: "Como quieras. Vení con la ropa que te haga sentir cómodo, no hace falta nada formal.",
    },
    {
      title: "Niños y adolescentes",
      text: "Mientras dura el culto, los más chicos tienen su propio espacio en la Escuela Bíblica, con maestros y actividades pensadas para ellos.",
    },
    {
      title: "¿Cómo llego?",
      text: `Estamos en ${churchInfo.address}, en el edificio conocido en el barrio como el "Ex Cine Progreso". Hay colectivos y opciones de estacionamiento en la zona.`,
    },
    {
      title: "¿Y si no creo en nada de esto?",
      text: "No hay problema. Vení a observar, a escuchar, a hacer preguntas. Nadie te va a obligar a nada: la puerta está abierta para vos tal cual estás.",
    },
    {
      title: "¿Voy a estar solo?",
      text: "Nuestro equipo de bienvenida te va a recibir en la entrada, y con gusto te acompaña a un lugar y responde cualquier duda.",
    },
  ];

  return (
    <>
      <section className="section py-20 sm:py-24">
        <p className="eyebrow">Bienvenido a casa</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
          ¿Es tu primera vez?
        </h1>
        <p className="mt-6 max-w-2xl text-ink/65">
          Te contamos lo esencial para llegar tranquilo a {churchInfo.auditoriumName}:
          horarios, ubicación y qué vas a encontrar al entrar.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <ExternalButtonLink
            href={`https://www.google.com/maps?q=${encodeURIComponent(churchInfo.mapsQuery)}`}
          >
            Cómo llegar
          </ExternalButtonLink>
          <ButtonLink href="/reuniones" variant="secondary">
            Ver horarios de reunión
          </ButtonLink>
        </div>
      </section>

      <section className="bg-mist py-16 text-ink sm:py-20">
        <div className="section">
          <p className="eyebrow">Qué esperar</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
            Lo importante, sin vueltas
          </h2>
          <FirstVisitAccordion items={firstVisitItems} />
        </div>
      </section>

      <section className="section py-16 sm:py-20">
        {/* EN VIVO PRIMERO */}
        <div className="flex flex-col items-start gap-4 border-y border-ink/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">¿Preferís mirar antes de venir?</p>
            <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
              Mirá una reunión antes de venir
            </h2>
            <p className="mt-2 max-w-lg text-sm text-ink/65">
              Podés conocernos primero desde tu casa, viendo la última reunión o
              acompañándonos cuando transmitimos por YouTube.
            </p>
          </div>
          <ButtonLink href="/en-vivo" variant="secondary" className="shrink-0">
            Ir a En vivo
          </ButtonLink>
        </div>

        {/* CONTACTO DIRECTO */}
        <div className="mt-10 border-y border-ink/10 py-6">
          <p className="eyebrow">¿Tenés dudas?</p>
          <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
            ¿Tenés una consulta?
          </h2>
          <p className="mt-2 max-w-lg text-sm text-ink/65">
            Contanos cualquier duda antes de tu visita: dónde estacionar, cómo
            llegar en colectivo, o lo que necesites.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <ExternalButtonLink
              href={churchInfo.prayerRequest.whatsappLink}
              size="sm"
            >
              <SocialBrandIcon platform="whatsapp" />
              Escribir por WhatsApp
            </ExternalButtonLink>
            <ButtonLink href="/contacto" variant="secondary" size="sm">
              Ir a Contacto
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

