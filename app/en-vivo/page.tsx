import type { Metadata } from "next";
import Link from "next/link";
import { churchInfo } from "@/lib/data";
import BigPlayer from "@/components/big-player";
import CultoBadge from "@/components/culto-badge";
import CultoPlayer from "@/components/culto-player";
import LiveOrder from "@/components/live-order";

export const metadata: Metadata = {
  title: "En vivo",
  description:
    "Escuchá Radio Manantial las 24 horas y mirá la transmisión en vivo de nuestro culto de los domingos por YouTube.",
};

export default function EnVivoPage() {
  const radioBlock = (
    <div className="mt-16">
      <div className="mb-6 flex items-center gap-3">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand" />
        </span>
        <h2 className="font-display text-2xl font-bold uppercase tracking-normal">
          {churchInfo.radioName} · en vivo las 24 h
        </h2>
      </div>
      <BigPlayer />
    </div>
  );

  const cultoBlock = (
    <div className="mt-16">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h2 className="font-display text-2xl font-bold uppercase tracking-normal">
          Culto en vivo por YouTube
        </h2>
        <CultoBadge />
      </div>

      <div className="card overflow-hidden">
        <CultoPlayer />
        <div className="flex flex-wrap items-center justify-between gap-4 p-6 sm:p-8">
          <p className="max-w-lg text-sm text-white/60">
            Fuera de horario de transmisión vas a ver acá el último culto
            completo. Cuando estemos en vivo, este mismo espacio se actualiza
            automáticamente.
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
    <section className="section py-28">
      <p className="eyebrow">Ahora mismo</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
        Todo lo que transmitimos en vivo
      </h1>
      <p className="mt-6 max-w-2xl text-white/60">
        Nuestra radio suena las 24 horas del día y, además, transmitimos el
        culto de los {churchInfo.liveServiceSchedule.toLowerCase()} por YouTube
        para que puedas acompañarnos estés donde estés.
      </p>

      <LiveOrder radio={radioBlock} culto={cultoBlock} />

      {/* REDES */}
      <div className="mt-20 card p-8 sm:p-10">
        <p className="eyebrow">Seguinos</p>
        <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
          No te pierdas nada
        </h2>
        <p className="mt-3 max-w-lg text-sm text-white/60">
          Sumate a nuestras redes para enterarte de horarios especiales,
          avisos y contenido de la semana.
        </p>
        <div className="mt-6 flex flex-wrap gap-4">
          <a href={churchInfo.whatsappChannelUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2.5 !px-5 text-xs">
            Canal de WhatsApp
          </a>
          <a href={churchInfo.social.instagram} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2.5 !px-5 text-xs">
            Instagram
          </a>
          <a href={churchInfo.social.youtube} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2.5 !px-5 text-xs">
            YouTube
          </a>
          <a href={churchInfo.social.facebook} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2.5 !px-5 text-xs">
            Facebook
          </a>
          <a href={churchInfo.social.tiktok} target="_blank" rel="noopener noreferrer" className="btn-secondary !py-2.5 !px-5 text-xs">
            TikTok
          </a>
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

