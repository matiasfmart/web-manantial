import Image from "next/image";
import { getChurchInfo, getGeneralServices, getMinistries, getRadioSchedule, getSpecialServices, transmissionInfo } from "@/lib/data";
import { getTransmissionStatus } from "@/lib/youtube";
import { formatScheduleDate, getFeaturedHomeActivity, getNextPublicGathering, getServiceLocation } from "@/lib/schedule";
import { getCurrentRadioProgram } from "@/lib/radio-schedule";
import MinistryCard from "@/components/ministry-card";
import CultoBadge from "@/components/culto-badge";
import CultoPlayer from "@/components/culto-player";
import RadioStrip from "@/components/radio-strip";
import AnimatedCounter from "@/components/animated-counter";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { ExternalInteractiveLink, InteractiveLink } from "@/components/ui/interactive-link";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [churchInfo, generalServices, ministries, radioSchedule, specialServices] = await Promise.all([
    getChurchInfo(),
    getGeneralServices(),
    getMinistries(),
    getRadioSchedule(),
    getSpecialServices(),
  ]);
  const transmissionStatus = churchInfo.youtubeChannelId
    ? await getTransmissionStatus(churchInfo.youtubeChannelId)
    : ({ kind: "unavailable" } as const);
  const nextPublicGathering = getNextPublicGathering(generalServices, specialServices);
  const featuredHomeActivity = getFeaturedHomeActivity(specialServices);
  const weeklyHighlights = ["Martes", "Miércoles", "Sábados", "Domingos"]
    .map((day) => generalServices.find((service) => service.day === day && service.isPublic))
    .filter((service): service is NonNullable<typeof service> => Boolean(service));
  const featuredMinistries = ministries.filter((ministry) => ministry.featured);
  const ministriesForHome = (featuredMinistries.length > 0 ? featuredMinistries : ministries)
    .sort((left, right) => (left.featuredOrder ?? Number.MAX_SAFE_INTEGER) - (right.featuredOrder ?? Number.MAX_SAFE_INTEGER))
    .slice(0, 3);
  const currentRadioProgram = getCurrentRadioProgram(radioSchedule);
  const radioCard = <RadioStrip churchInfo={churchInfo} currentProgram={currentRadioProgram} variant="dark" />;

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
          {transmissionStatus.kind === "live" ? (
            <ButtonLink href="/en-vivo" variant="onair" tone="dark" className="mt-7 w-full sm:w-auto">
              Ver transmisión en vivo
            </ButtonLink>
          ) : transmissionStatus.kind === "latest" ? (
            <ButtonLink href="/en-vivo" variant="secondary" tone="dark" className="mt-7 w-full sm:w-auto">
              Ver última reunión
            </ButtonLink>
          ) : (
            <ExternalInteractiveLink href={churchInfo.social.youtube} className="mt-7 inline-block text-sm font-semibold text-white/70 hover:text-white">
              Ir al canal de YouTube
            </ExternalInteractiveLink>
          )}
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
          <p className="eyebrow !text-white/60 opacity-0 animate-[revealUp_560ms_cubic-bezier(0.22,1,0.36,1)_120ms_forwards]">{churchInfo.home.heroKicker} · Villa Lugano</p>
          <h1 className="mt-6 max-w-4xl opacity-0 animate-[revealUp_660ms_cubic-bezier(0.22,1,0.36,1)_260ms_forwards] font-display font-display-emphasis text-6xl font-semibold leading-[0.98] tracking-normal text-white sm:text-7xl lg:text-8xl">
            {churchInfo.home.heroTitle}
          </h1>
          <p className="mt-8 max-w-xl opacity-0 animate-[revealUp_620ms_cubic-bezier(0.22,1,0.36,1)_420ms_forwards] text-lg leading-relaxed text-white/70">
            {churchInfo.home.heroText}
          </p>
          <div className="mt-10 flex flex-wrap gap-4 opacity-0 animate-[revealUp_520ms_cubic-bezier(0.22,1,0.36,1)_560ms_forwards]">
            <ButtonLink href="/reuniones" variant="primary" tone="dark">
              Ver horarios
            </ButtonLink>
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 opacity-0 animate-[revealUp_460ms_cubic-bezier(0.22,1,0.36,1)_680ms_forwards]">
            <InteractiveLink href="/primera-vez" className="text-sm font-medium text-white/80 hover:text-white">¿Es tu primera vez? Empezá acá</InteractiveLink>
            <InteractiveLink href="/radio" className="text-sm font-medium text-white/70 hover:text-white">Escuchar radio</InteractiveLink>
          </div>
        </div>
      </section>

      {nextPublicGathering && (
        <section className="bg-mist py-10 text-ink sm:py-12">
          <div className="section border-y border-ink/15 px-5 py-6 sm:flex sm:items-end sm:justify-between sm:px-8 sm:py-7">
            <div>
              <p className="eyebrow">Próxima reunión</p>
              <time className="mt-3 block font-display font-display-emphasis text-3xl font-semibold text-ink sm:text-4xl">
                {formatScheduleDate(nextPublicGathering.date, nextPublicGathering.time)}
              </time>
              <p className="mt-2 font-display text-xl font-semibold text-carbon">{nextPublicGathering.label}</p>
              <p className="mt-1 text-sm text-copy">{getServiceLocation(nextPublicGathering)}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 sm:mt-0">
              {nextPublicGathering.location !== "homes" && (
                <ExternalButtonLink href={`https://maps.google.com/?q=${encodeURIComponent(churchInfo.mapsQuery)}`}>
                  Cómo llegar
                </ExternalButtonLink>
              )}
              <ButtonLink href="/reuniones" variant="secondary">Ver agenda</ButtonLink>
            </div>
          </div>
        </section>
      )}

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
              {churchInfo.home.welcomeTitle}
            </h2>
            <p className="mt-6 max-w-lg text-ink/60">
              {churchInfo.home.welcomeText}
            </p>
            <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4" data-stagger>
              {churchInfo.home.stats.map(([n, l]) => (
                <div key={l}>
                  <p className="font-display font-display-emphasis text-4xl font-semibold text-brand-dark"><AnimatedCounter value={n} /></p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink/50">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-brand/15 bg-surface py-6">
        <div className="section">
          <div className="flex items-center justify-between gap-4">
            <p className="eyebrow">Durante la semana</p>
            <InteractiveLink href="/reuniones" className="text-xs font-semibold text-brand-dark">Ver agenda y actividades</InteractiveLink>
          </div>
          <div className="marquee-mask mt-4 overflow-hidden">
            <div className="marquee-track flex animate-marquee gap-10 whitespace-nowrap text-sm font-medium text-ink/65">
            {[...weeklyHighlights, ...weeklyHighlights].map((s, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                {s.day} · {s.label}
              </span>
            ))}
            </div>
          </div>
        </div>
      </section>

      {featuredHomeActivity && (
        <section className="bg-white py-8 text-ink sm:py-10">
          <div className="section border-y border-brand/25 py-6 sm:flex sm:items-end sm:justify-between sm:gap-8">
            <div>
              <p className="eyebrow">Encuentro destacado</p>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-normal sm:text-3xl">
                {featuredHomeActivity.title}
              </h2>
              <p className="mt-2 text-sm text-copy">
                {formatScheduleDate(featuredHomeActivity.date, featuredHomeActivity.time)}
                {featuredHomeActivity.audience ? ` · ${featuredHomeActivity.audience}` : ""}
              </p>
            </div>
            {/^https?:\/\//.test(featuredHomeActivity.ctaUrl) ? (
              <ExternalButtonLink href={featuredHomeActivity.ctaUrl} variant="secondary" className="mt-5 sm:mt-0">
                {featuredHomeActivity.ctaLabel}
              </ExternalButtonLink>
            ) : (
              <ButtonLink href={featuredHomeActivity.ctaUrl} variant="secondary" className="mt-5 sm:mt-0">
                {featuredHomeActivity.ctaLabel}
              </ButtonLink>
            )}
          </div>
        </section>
      )}

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
                <div><p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/45">Video</p>{youtubeCard}</div>
                {radioCard}
              </>
            ) : (
              <>
                {radioCard}
                <div><p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/45">Video</p>{youtubeCard}</div>
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
                Ministerios destacados
              </h2>
            </div>
            <ButtonLink href="/ministerios" variant="secondary" className="shrink-0">
              Ver todos los ministerios
            </ButtonLink>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
            {ministriesForHome.map((m) => (
              <MinistryCard key={m.slug} ministry={m} variant="light" />
            ))}
          </div>
          <div className="mt-10 border-y border-ink/10 py-6 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="font-display text-xl font-semibold text-ink">¿No sabés por dónde empezar?</p>
              <p className="mt-2 text-sm text-copy">Te contamos horarios, cómo llegar y qué esperar en tu primera visita.</p>
            </div>
            <ButtonLink href="/primera-vez" variant="secondary" className="mt-5 sm:mt-0">Empezá acá</ButtonLink>
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
