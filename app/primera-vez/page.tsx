import type { Metadata } from "next";
import Link from "next/link";
import { churchInfo } from "@/lib/data";
import { SocialBrandIcon } from "@/components/social-icons";

export const metadata: Metadata = {
  title: "Primera vez",
  description:
    "¿Es tu primera vez en Ministerio Manantial de Avivamiento? Conocé qué esperar, cómo llegar y todo lo que necesitás saber antes de tu visita.",
};

export default function PrimeraVezPage() {
  return (
    <>
      <section className="section py-20 sm:py-24">
        <p className="eyebrow">Bienvenido a casa</p>
        <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
          ¿Es tu primera vez?
        </h1>
        <p className="mt-6 max-w-2xl text-white/60">
          Nos alegra muchísimo que quieras conocernos. Acá te contamos todo lo
          que necesitás saber antes de tu primera visita a{" "}
          {churchInfo.auditoriumName}, para que te sientas como en casa desde el
          primer minuto.
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

      {/* QUE ESPERAR (fondo claro para mejor lectura) */}
      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section">
          <p className="eyebrow !text-brand">Qué esperar</p>
          <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
            Todo lo que necesitás saber
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <InfoCard
              title="¿Cuánto dura?"
              text="Nuestras reuniones generales duran entre una hora y media y dos horas: alabanza, palabra y un momento de oración."
            />
            <InfoCard
              title="¿Cómo me visto?"
              text="Como quieras. Vení con la ropa que te haga sentir cómodo, no hace falta nada formal."
            />
            <InfoCard
              title="Niños y adolescentes"
              text="Mientras dura el culto, los más chicos tienen su propio espacio en la Escuela Bíblica, con maestros y actividades pensadas para ellos."
            />
            <InfoCard
              title="¿Cómo llego?"
              text={`Estamos en ${churchInfo.address}, en el edificio conocido en el barrio como el "Ex Cine Progreso". Hay colectivos y opciones de estacionamiento en la zona.`}
            />
            <InfoCard
              title="¿Y si no creo en nada de esto?"
              text="No hay problema. Vení a observar, a escuchar, a hacer preguntas. Nadie te va a obligar a nada: la puerta está abierta para vos tal cual estás."
            />
            <InfoCard
              title="¿Voy a estar solo?"
              text="Nuestro equipo de bienvenida te va a recibir en la entrada, y con gusto te acompaña a un lugar y responde cualquier duda."
            />
          </div>
        </div>
      </section>

      <section className="section py-16 sm:py-20">
        {/* EN VIVO PRIMERO */}
        <div className="flex flex-col items-start gap-4 border-y border-white/10 py-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">¿Preferís mirar antes de venir?</p>
            <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
              Mirá una reunión en vivo o grabada
            </h2>
            <p className="mt-2 max-w-lg text-sm text-white/60">
              Podés conocernos primero desde tu casa, viendo la última reunión o
              acompañándonos cuando transmitimos por YouTube.
            </p>
          </div>
          <Link href="/en-vivo" className="btn-secondary shrink-0">
            Ir a En vivo
          </Link>
        </div>

        {/* CONTACTO DIRECTO */}
        <div className="mt-10 border-y border-white/10 py-6">
          <p className="eyebrow">¿Tenés dudas?</p>
          <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
            Escribinos, con gusto te ayudamos
          </h2>
          <p className="mt-2 max-w-lg text-sm text-white/60">
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

function InfoCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-ink/15 pt-5">
      <h3 className="font-display text-lg font-bold uppercase tracking-normal text-brand">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-ink/60">{text}</p>
    </div>
  );
}

