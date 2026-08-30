import Image from "next/image";
import { getChurchInfo, getGeneralServices, getMinistries, transmissionInfo } from "@/lib/data";
import { getTransmissionStatus } from "@/lib/youtube";
import MinistryCard from "@/components/ministry-card";
import CultoBadge from "@/components/culto-badge";
import CultoPlayer from "@/components/culto-player";
import RadioStrip from "@/components/radio-strip";
import AnimatedCounter from "@/components/animated-counter";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { InteractiveLink } from "@/components/ui/interactive-link";

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
    <div className="border-y border-white/15 py-6 text-white">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-widest text-white/60">
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
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Reuniones generales, Noche de Unción, Santa Cena y encuentros especiales.
          </p>
          <ButtonLink href="/en-vivo" variant="onair" tone="dark" className="mt-7 w-full sm:w-auto">
            Ver transmisión
          </ButtonLink>
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
          className="hero-image-slow object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
        <div className="absolute inset-0 bg-hero-grid bg-[size:48px_48px] opacity-20" />
        <div className="absolute inset-0 bg-radial-fade" />

        <div className="section relative z-10 py-32">
          <p className="eyebrow !text-white/60 opacity-0 animate-[revealUp_560ms_cubic-bezier(0.22,1,0.36,1)_120ms_forwards]">Villa Lugano · Buenos Aires</p>
          <h1 className="mt-6 max-w-4xl opacity-0 animate-[revealUp_660ms_cubic-bezier(0.22,1,0.36,1)_260ms_forwards] font-display text-6xl font-semibold leading-[0.98] tracking-normal text-white sm:text-7xl lg:text-8xl">
            Una comunidad de fe en Villa Lugano.
          </h1>
          <p className="mt-8 max-w-xl opacity-0 animate-[revealUp_620ms_cubic-bezier(0.22,1,0.36,1)_420ms_forwards] text-lg leading-relaxed text-white/70">
            Somos {churchInfo.shortName}, un ministerio cristiano evangélico en
            el histórico {churchInfo.historicNote.replace(/^Conocido en el barrio de Lugano como el /, "")}.
            Reuniones, comunidad y acompañamiento espiritual para toda la familia.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 opacity-0 animate-[revealUp_520ms_cubic-bezier(0.22,1,0.36,1)_560ms_forwards]">
            <ButtonLink href="/reuniones" variant="primary" tone="dark">
              Ver horarios
            </ButtonLink>
            <InteractiveLink href="/radio" className="inline-flex items-center text-sm font-medium text-white/75 hover:text-white">
              Escuchar radio
            </InteractiveLink>
          </div>
          <InteractiveLink
            href="/primera-vez"
            className="mt-6 inline-block opacity-0 animate-[revealUp_460ms_cubic-bezier(0.22,1,0.36,1)_680ms_forwards] text-sm font-medium text-white/70 hover:text-white"
          >
            ¿Es tu primera vez? Empezá acá
          </InteractiveLink>
        </div>
      </section>

      {/* BIENVENIDA */}
      <section className="bg-mist py-16 sm:py-20 text-ink">
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
            <p className="eyebrow">Bienvenido a casa</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-normal text-ink sm:text-5xl">
              {churchInfo.shortName}
            </h2>
            <p className="mt-6 max-w-lg text-ink/60">
              Una iglesia moderna en el corazón de Villa Lugano, donde cada
              generación encuentra un lugar: familias, jóvenes, niños y
              adultos mayores, todos bienvenidos tal cual son.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4" data-stagger>
              {[
                ["7", "Áreas ministeriales"],
                ["24/7", "Radio en vivo"],
                ["+25", "Años haciendo Iglesia"],
                ["1", "Familia"],
              ].map(([n, l]) => (
                <div key={l}>
                  <p className="font-display text-4xl font-semibold text-brand-dark"><AnimatedCounter value={n} /></p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROXIMAS REUNIONES */}
      <section className="border-y border-brand/15 bg-surface py-6">
        <div className="section marquee-mask overflow-hidden">
          <div className="marquee-track flex animate-marquee gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-wide text-ink/65">
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
      <section className="bg-ink py-16 text-white sm:py-20">
        <div className="section">
          <p className="eyebrow !text-white/55">Online</p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-normal sm:text-5xl">
            Radio y transmisiones en vivo
          </h2>
          <p className="mt-6 max-w-xl text-white/65">
            Nuestra radio suena las 24 horas y, además, transmitimos por YouTube
            reuniones generales, Noche de Unción, Santa Cena y encuentros
            especiales.
          </p>

          <div className="mt-10 space-y-5">
            {transmissionStatus.kind === "live" ? (
              <>
                {youtubeCard}
                <RadioStrip churchInfo={churchInfo} variant="dark" />
              </>
            ) : (
              <>
                <RadioStrip churchInfo={churchInfo} variant="dark" />
                {youtubeCard}
              </>
            )}
          </div>
        </div>
      </section>

      {/* MINISTERIOS */}
      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow">Vida en comunidad</p>
              <h2 className="mt-4 font-display text-4xl font-semibold tracking-normal text-ink sm:text-5xl">
                Nuestras áreas ministeriales
              </h2>
            </div>
            <ButtonLink href="/ministerios" variant="secondary" className="shrink-0">
              Ver todos los ministerios
            </ButtonLink>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
            {ministries.map((m) => (
              <MinistryCard key={m.slug} ministry={m} variant="light" />
            ))}
          </div>
        </div>
      </section>

      {/* UBICACION */}
      <section className="section py-16 sm:py-20">
        <div className="grid grid-cols-1 overflow-hidden border-y border-ink/10 lg:grid-cols-2">
          <div className="p-6 sm:p-8 lg:p-10">
            <p className="eyebrow">Te esperamos</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-normal sm:text-4xl">
              {churchInfo.auditoriumName}
            </h2>
            <p className="mt-4 text-ink/65">{churchInfo.address}</p>
            <p className="mt-2 text-sm italic text-ink/45">
              {churchInfo.historicNote}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <ExternalButtonLink
                href={`https://maps.google.com/?q=${encodeURIComponent(
                  churchInfo.mapsQuery
                )}`}
              >
                Cómo llegar
              </ExternalButtonLink>
              <ButtonLink href="/contacto" variant="secondary">
                Contactanos
              </ButtonLink>
            </div>
          </div>
          <div className="min-h-[280px] w-full" data-reveal style={{ "--motion-delay": "180ms" } as React.CSSProperties}>
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
