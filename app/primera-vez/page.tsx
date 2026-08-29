import type { Metadata } from "next";
import Link from "next/link";
import { getChurchInfo } from "@/lib/data";
import { SocialBrandIcon } from "@/components/social-icons";

export const metadata: Metadata = {
  title: "Primera vez",
  description:
    "¿Es tu primera vez en Ministerio Manantial de Avivamiento? Conocé qué esperar, cómo llegar y todo lo que necesitás saber antes de tu visita.",
};

export default async function PrimeraVezPage() {
  const churchInfo = await getChurchInfo();

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
          <a
            href={`https://www.google.com/maps?q=${encodeURIComponent(churchInfo.mapsQuery)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            Cómo llegar
          </a>
          <Link href="/reuniones" className="btn-secondary">
            Ver horarios de reunión
          </Link>
        </div>
      </section>

      <section className="bg-mist py-16 text-ink sm:py-20">
        <div className="section">
          <p className="eyebrow">Qué esperar</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
            Lo importante, sin vueltas
          </h2>
          <div className="mt-8 divide-y divide-line border-y border-line">
            <InfoItem
              title="¿Cuánto dura?"
              text="Nuestras reuniones generales duran entre una hora y media y dos horas: alabanza, palabra y un momento de oración."
            />
            <InfoItem
              title="¿Cómo me visto?"
              text="Como quieras. Vení con la ropa que te haga sentir cómodo, no hace falta nada formal."
            />
            <InfoItem
              title="Niños y adolescentes"
              text="Mientras dura el culto, los más chicos tienen su propio espacio en la Escuela Bíblica, con maestros y actividades pensadas para ellos."
            />
            <InfoItem
              title="¿Cómo llego?"
              text={`Estamos en ${churchInfo.address}, en el edificio conocido en el barrio como el "Ex Cine Progreso". Hay colectivos y opciones de estacionamiento en la zona.`}
            />
            <InfoItem
              title="¿Y si no creo en nada de esto?"
              text="No hay problema. Vení a observar, a escuchar, a hacer preguntas. Nadie te va a obligar a nada: la puerta está abierta para vos tal cual estás."
            />
            <InfoItem
              title="¿Voy a estar solo?"
              text="Nuestro equipo de bienvenida te va a recibir en la entrada, y con gusto te acompaña a un lugar y responde cualquier duda."
            />
          </div>
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
          <Link href="/en-vivo" className="btn-secondary shrink-0">
            Ir a En vivo
          </Link>
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
            <a
              href={churchInfo.prayerRequest.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary !py-2.5 !px-5 text-xs"
            >
              <SocialBrandIcon platform="whatsapp" />
              Escribir por WhatsApp
            </a>
            <Link href="/contacto" className="btn-secondary !py-2.5 !px-5 text-xs">
              Ir a Contacto
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function InfoItem({ title, text }: { title: string; text: string }) {
  return (
    <details className="group py-5 transition-colors open:bg-white/45 sm:px-3">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-semibold text-ink">
        {title}
        <span className="text-xl font-normal text-muted transition group-open:rotate-45">+</span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-copy">{text}</p>
    </details>
  );
}

