import Image from "next/image";
import Link from "next/link";
import { churchInfo, generalServices, ministries } from "@/lib/data";
import MinistryCard from "@/components/ministry-card";
import CultoBadge from "@/components/culto-badge";
import CultoPlayer from "@/components/culto-player";
import LiveOrder from "@/components/live-order";

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-ink">
        <Image
          src="/images/hero/home-1.jpg"
          alt="Culto en el auditorio de Manantial de Avivamiento"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="absolute inset-0 bg-hero-grid bg-[size:48px_48px] opacity-20" />
        <div className="absolute inset-0 bg-radial-fade" />

        <div className="section relative z-10 py-32">
          <p className="eyebrow">Villa Lugano · Buenos Aires</p>
          <h1 className="mt-6 max-w-4xl font-display text-6xl font-black uppercase leading-[0.95] tracking-normal sm:text-7xl lg:text-8xl">
            Una fe viva.
            <br />
            <span className="bg-gradient-to-r from-brand to-gold bg-clip-text text-transparent">
              Una casa para vos.
            </span>
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70">
            Somos {churchInfo.shortName}, una comunidad cristiana evangélica
            moderna en el histórico {churchInfo.historicNote.replace(/^Conocido en el barrio de Lugano como el /, "")}.
            Te esperamos en nuestras reuniones y las 24 horas en nuestra radio online.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/radio" className="btn-primary">
              Escuchar radio en vivo
            </Link>
            <Link href="/reuniones" className="btn-secondary">
              Ver horarios de reunión
            </Link>
          </div>
          <Link
            href="/primera-vez"
            className="mt-6 inline-block text-sm font-semibold text-white/60 underline underline-offset-4 hover:text-white"
          >
            ¿Es tu primera vez? Empezá acá
          </Link>
        </div>
      </section>

      {/* BIENVENIDA */}
      <section className="bg-white py-24 text-ink">
        <div className="section grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 h-80 w-full overflow-hidden rounded-2xl shadow-xl sm:h-[420px] lg:order-1">
            <Image
              src="/images/hero/home-2.jpg"
              alt={`Encuentro de ${churchInfo.shortName}`}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="order-1 lg:order-2">
            <p className="eyebrow !text-brand">Bienvenido a casa</p>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-normal text-ink sm:text-5xl">
              {churchInfo.shortName}
            </h2>
            <p className="mt-6 max-w-lg text-ink/60">
              Una iglesia moderna en el corazón de Villa Lugano, donde cada
              generación encuentra un lugar: familias, jóvenes, niños y
              adultos mayores, todos bienvenidos tal cual son.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {[
                ["7", "Áreas ministeriales"],
                ["24/7", "Radio en vivo"],
                ["+25", "Años haciendo Iglesia"],
                ["1", "Familia"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-4xl font-black text-brand">{n}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROXIMAS REUNIONES */}
      <section className="border-y border-white/10 bg-surface py-6">
        <div className="section overflow-hidden">
          <div className="flex animate-marquee gap-10 whitespace-nowrap text-sm font-semibold uppercase tracking-wide text-white/60">
            {[...generalServices, ...generalServices].map((s, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {s.day} {s.time} — {s.label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* EN VIVO */}
      <section className="section py-24">
        <p className="eyebrow">Transmisiones en vivo</p>
        <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-normal sm:text-5xl">
          Acompañanos estés donde estés
        </h2>
        <p className="mt-6 max-w-xl text-white/60">
          Nuestra radio suena las 24 horas y, además, transmitimos el culto de
          los {churchInfo.liveServiceSchedule.toLowerCase()} en vivo por
          YouTube.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <LiveOrder
            radio={
              <div className="card relative overflow-hidden p-8 sm:p-10">
                <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand/30 blur-3xl" />
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-light">
                  <span className="h-2 w-2 animate-pulseSlow rounded-full bg-brand-light" />
                  On air · 24 h
                </div>
                <p className="mt-6 font-display text-2xl font-bold uppercase tracking-normal">
                  {churchInfo.radioName}
                </p>
                <p className="mt-1 text-sm text-white/50">
                  Alabanza, prédicas y contenido para toda la familia, sin parar.
                </p>
                <div className="mt-8 flex h-16 items-end gap-1">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <span
                      key={i}
                      className="w-2 flex-1 rounded-full bg-gradient-to-t from-brand to-gold"
                      style={{ height: `${20 + ((i * 37) % 80)}%` }}
                    />
                  ))}
                </div>
                <Link href="/en-vivo" className="btn-primary mt-8 w-full sm:w-auto">
                  Escuchar ahora
                </Link>
              </div>
            }
            culto={
              <div className="card relative overflow-hidden p-8 sm:p-10">
                <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl" />
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-white/60">
                    Culto por YouTube
                  </span>
                  <CultoBadge />
                </div>
                <p className="mt-6 font-display text-2xl font-bold uppercase tracking-normal">
                  Transmisión del culto
                </p>
                <p className="mt-1 text-sm text-white/50">
                  En vivo los {churchInfo.liveServiceSchedule.toLowerCase()}, con
                  repetición disponible el resto de la semana.
                </p>
                <div className="mt-8">
                  <CultoPlayer compact />
                </div>
                <Link href="/en-vivo" className="btn-secondary mt-8 w-full sm:w-auto">
                  Ver transmisión
                </Link>
              </div>
            }
          />
        </div>
      </section>

      {/* MINISTERIOS */}
      <section className="section py-24">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Vida en comunidad</p>
            <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-normal sm:text-5xl">
              Nuestras áreas ministeriales
            </h2>
          </div>
          <Link href="/ministerios" className="btn-secondary shrink-0">
            Ver todos los ministerios
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m) => (
            <MinistryCard key={m.slug} ministry={m} />
          ))}
        </div>
      </section>

      {/* UBICACION */}
      <section className="section pb-24">
        <div className="card grid grid-cols-1 gap-0 overflow-hidden lg:grid-cols-2">
          <div className="p-10 lg:p-14">
            <p className="eyebrow">Te esperamos</p>
            <h2 className="mt-4 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
              {churchInfo.auditoriumName}
            </h2>
            <p className="mt-4 text-white/60">{churchInfo.address}</p>
            <p className="mt-2 text-sm italic text-white/40">
              {churchInfo.historicNote}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  churchInfo.mapsQuery
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Cómo llegar
              </a>
              <Link href="/contacto" className="btn-secondary">
                Contactanos
              </Link>
            </div>
          </div>
          <div className="min-h-[280px] w-full">
            <iframe
              title="Ubicación del auditorio"
              className="h-full w-full min-h-[280px] grayscale"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${encodeURIComponent(
                churchInfo.mapsQuery
              )}&output=embed`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
