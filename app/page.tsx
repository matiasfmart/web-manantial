import Image from "next/image";
import Link from "next/link";
import { getChurchInfo, getGeneralServices, getMinistries, transmissionInfo } from "@/lib/data";
import { getTransmissionStatus } from "@/lib/youtube";
import MinistryCard from "@/components/ministry-card";
import CultoBadge from "@/components/culto-badge";
import CultoPlayer from "@/components/culto-player";
import RadioStrip from "@/components/radio-strip";

export default async function HomePage() {
  const [churchInfo, generalServices, ministries] = await Promise.all([
    getChurchInfo(),
    getGeneralServices(),
    getMinistries(),
  ]);
  const transmissionStatus = churchInfo.youtubeChannelId
    ? await getTransmissionStatus(churchInfo.youtubeChannelId)
    : ({ kind: "unavailable" } as const);

  const youtubeCard = (
    <div className="border-y border-white/10 py-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-white/60">
              YouTube
            </span>
            <CultoBadge status={transmissionStatus} />
          </div>
          <p className="mt-5 font-display text-2xl font-bold uppercase tracking-normal sm:text-3xl">
            {transmissionStatus.kind === "live"
              ? transmissionInfo.liveLabel
              : transmissionStatus.kind === "latest"
                ? transmissionInfo.latestLabel
                : transmissionInfo.title}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/55">
            Reuniones generales, Noche de Unción, Santa Cena y encuentros especiales.
          </p>
          <Link href="/en-vivo" className="btn-secondary mt-7 w-full sm:w-auto">
            Ver transmisión
          </Link>
        </div>
        <CultoPlayer compact status={transmissionStatus} />
      </div>
    </div>
  );

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
      <section className="bg-white py-16 sm:py-20 text-ink">
        <div className="section grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative order-2 h-80 w-full overflow-hidden sm:h-[420px] lg:order-1">
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
      <section className="section py-16 sm:py-20">
        <p className="eyebrow">Transmisiones en vivo</p>
        <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-normal sm:text-5xl">
          Acompañanos estés donde estés
        </h2>
        <p className="mt-6 max-w-xl text-white/60">
          Nuestra radio suena las 24 horas y, además, transmitimos por YouTube
          reuniones generales, Noche de Unción, Santa Cena y encuentros
          especiales.
        </p>

        <div className="mt-10 space-y-5">
          {transmissionStatus.kind === "live" ? (
            <>
              {youtubeCard}
              <RadioStrip churchInfo={churchInfo} />
            </>
          ) : (
            <>
              <RadioStrip churchInfo={churchInfo} />
              {youtubeCard}
            </>
          )}
        </div>
      </section>

      {/* MINISTERIOS */}
      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow !text-brand">Vida en comunidad</p>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-normal text-ink sm:text-5xl">
                Nuestras áreas ministeriales
              </h2>
            </div>
            <Link
              href="/ministerios"
              className="inline-flex shrink-0 items-center justify-center gap-2 border border-ink/20 bg-transparent px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink transition hover:border-ink/40 hover:bg-ink/5"
            >
              Ver todos los ministerios
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ministries.map((m) => (
              <MinistryCard key={m.slug} ministry={m} variant="light" />
            ))}
          </div>
        </div>
      </section>

      {/* UBICACION */}
      <section className="section py-16 sm:py-20">
        <div className="grid grid-cols-1 overflow-hidden border-y border-white/10 lg:grid-cols-2">
          <div className="p-6 sm:p-8 lg:p-10">
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
