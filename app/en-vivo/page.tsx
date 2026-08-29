import type { Metadata } from "next";
import Link from "next/link";
import { churchInfo, specialServices, transmissionInfo } from "@/lib/data";
import { getTransmissionStatus } from "@/lib/youtube";
import BigPlayer from "@/components/big-player";
import CultoBadge from "@/components/culto-badge";
import CultoPlayer from "@/components/culto-player";
import { SocialTextLink } from "@/components/social-icons";

export const metadata: Metadata = {
  title: "En vivo",
  description:
    "Escuchá Radio Maranata las 24 horas y mirá las transmisiones en vivo de Ministerio Manantial de Avivamiento por YouTube.",
};

export default async function EnVivoPage() {
  const transmissionStatus = churchInfo.youtubeChannelId
    ? await getTransmissionStatus(churchInfo.youtubeChannelId)
    : ({ kind: "unavailable" } as const);

  const radioBlock = (
    <div className="mt-16">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
            </span>
            <p className="eyebrow">Audio 24 horas</p>
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal sm:text-3xl">
            {churchInfo.radioName}
          </h2>
        </div>
        <Link href="/radio" className="text-sm font-semibold text-brand-light underline underline-offset-4">
          Ver programación completa
        </Link>
      </div>

      <BigPlayer />

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="border-t border-white/10 pt-4">
          <p className="font-display text-lg font-bold uppercase tracking-normal">
            Siempre encendida
          </p>
          <p className="mt-2 text-sm text-white/55">
            Alabanza, palabra y compañía durante todo el día.
          </p>
        </div>
        <div className="border-t border-white/10 pt-4">
          <p className="font-display text-lg font-bold uppercase tracking-normal">
            Desde el auditorio
          </p>
          <p className="mt-2 text-sm text-white/55">
            Una señal pensada para acompañar a la iglesia y a cada familia.
          </p>
        </div>
        <div className="border-t border-white/10 pt-4">
          <p className="font-display text-lg font-bold uppercase tracking-normal">
            En la app
          </p>
          <p className="mt-2 text-sm text-white/55">
            Preparada para escucharse también desde iOS y Android.
          </p>
        </div>
      </div>
    </div>
  );

  const cultoBlock = (
    <div className="mt-16">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h2 className="font-display text-2xl font-bold uppercase tracking-normal">
          {transmissionInfo.title}
        </h2>
        <CultoBadge status={transmissionStatus} />
      </div>

      <div className="card overflow-hidden">
        <CultoPlayer status={transmissionStatus} />
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
          <p className="max-w-lg text-sm text-white/60">
            {transmissionStatus.kind === "live"
              ? "Esta transmisión viene directamente desde nuestro canal de YouTube."
              : "Cuando no estamos transmitiendo, este espacio muestra la última reunión disponible del canal. Si YouTube no devuelve un video válido, evitamos mostrar un reproductor roto."}
          </p>
          <a
            href={churchInfo.social.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary shrink-0"
          >
            Ver canal de YouTube
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <section className="section py-20 sm:py-24">
      <p className="eyebrow">Ahora mismo</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
        Todo lo que transmitimos en vivo
      </h1>
      <p className="mt-6 max-w-2xl text-white/60">
        Nuestra radio suena las 24 horas del día y, además, transmitimos por
        YouTube nuestras reuniones generales, noches especiales y encuentros
        que pueden surgir durante la semana.
      </p>

      {transmissionStatus.kind === "live" ? (
        <>
          {cultoBlock}
          {radioBlock}
        </>
      ) : (
        <>
          {radioBlock}
          {cultoBlock}
        </>
      )}

      <div className="mt-20">
        <p className="eyebrow">También transmitimos</p>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
          Reuniones fijas y encuentros especiales
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
          {transmissionInfo.description} Cuando el canal esté en vivo, esta
          página prioriza automáticamente la transmisión actual.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="card p-6">
            <p className="font-display text-lg font-bold uppercase tracking-normal">
              Reunión general
            </p>
            <p className="mt-2 text-sm font-semibold text-brand-light">
              {churchInfo.liveServiceSchedule}
            </p>
            <p className="mt-3 text-sm text-white/60">
              Transmisión habitual de la reunión dominical.
            </p>
          </div>
          {specialServices.map((service) => (
            <div key={service.name} className="card p-6">
              <p className="font-display text-lg font-bold uppercase tracking-normal">
                {service.name}
              </p>
              <p className="mt-2 text-sm font-semibold text-brand-light">
                {service.schedule}
              </p>
              <p className="mt-3 text-sm text-white/60">{service.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* REDES */}
      <div className="mt-16 card border-l-4 border-l-brand p-6 sm:p-8">
        <p className="eyebrow">Seguinos</p>
        <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
          No te pierdas nada
        </h2>
        <p className="mt-3 max-w-lg text-sm text-white/60">
          Sumate a nuestras redes para enterarte de horarios especiales,
          avisos y contenido de la semana.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <SocialTextLink href={churchInfo.whatsappChannelUrl} label="Canal de WhatsApp" platform="whatsapp" />
          <SocialTextLink href={churchInfo.social.instagram} label="Instagram" platform="instagram" />
          <SocialTextLink href={churchInfo.social.youtube} label="YouTube" platform="youtube" />
          <SocialTextLink href={churchInfo.social.facebook} label="Facebook" platform="facebook" />
          <SocialTextLink href={churchInfo.social.tiktok} label="TikTok" platform="tiktok" />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link href="/radio" className="text-sm font-semibold text-brand-light underline underline-offset-4">
          Ver programación completa de la radio
        </Link>
        <Link href="/reuniones" className="text-sm font-semibold text-brand-light underline underline-offset-4">
          Ver todos los horarios de reunión
        </Link>
      </div>
    </section>
  );
}

