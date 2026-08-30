import type { Metadata } from "next";
import { getChurchInfo, getGeneralServices, getSpecialServices } from "@/lib/data";
import { formatScheduleDate, getNextGeneralService, getNextSpecialOccurrence } from "@/lib/schedule";
import { getTransmissionStatus } from "@/lib/youtube";
import CultoBadge from "@/components/culto-badge";
import CultoPlayer from "@/components/culto-player";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "En vivo",
  description: "Mirá las transmisiones en vivo y las últimas reuniones de Ministerio Manantial de Avivamiento por YouTube.",
};

type UpcomingTransmission = {
  title: string;
  detail: string;
  startsAt: number;
};

export default async function EnVivoPage() {
  const [churchInfo, generalServices, specialServices] = await Promise.all([
    getChurchInfo(),
    getGeneralServices(),
    getSpecialServices(),
  ]);
  const transmissionStatus = churchInfo.youtubeChannelId
    ? await getTransmissionStatus(churchInfo.youtubeChannelId)
    : ({ kind: "unavailable" } as const);
  const nextGeneralTransmission = getNextGeneralService(
    generalServices.filter((service) => service.streamed)
  );
  const nextSpecialTransmissions = specialServices
    .filter((service) => service.nextStreamed ?? service.streamed)
    .map((service) => {
      const occurrence = getNextSpecialOccurrence(service);
      if (!occurrence) return null;

      return {
        title: service.name,
        detail: service.nextTime ?? service.time
          ? formatScheduleDate(occurrence.date, service.nextTime ?? service.time)
          : `${formatScheduleDate(occurrence.date)} · ${service.schedule}`,
        startsAt: toBuenosAiresTimestamp(occurrence.date, service.nextTime ?? service.time),
      } satisfies UpcomingTransmission;
    })
    .filter((service): service is UpcomingTransmission => Boolean(service));
  const upcomingTransmissions = [
    ...(nextGeneralTransmission
      ? [{
          title: nextGeneralTransmission.service.label,
          detail: formatScheduleDate(nextGeneralTransmission.date, nextGeneralTransmission.service.time),
          startsAt: toBuenosAiresTimestamp(nextGeneralTransmission.date, nextGeneralTransmission.service.time),
        } satisfies UpcomingTransmission]
      : []),
    ...nextSpecialTransmissions,
  ]
    .sort((left, right) => left.startsAt - right.startsAt)
    .slice(0, 3);
  const nextTransmission = upcomingTransmissions[0];

  const state = transmissionStatus.kind === "live"
    ? {
        eyebrow: "En vivo ahora",
        title: transmissionStatus.title || "Estamos transmitiendo en vivo.",
        description: "Estás mirando una reunión transmitida desde Manantial de Avivamiento.",
        tone: "dark",
      }
    : transmissionStatus.kind === "latest"
      ? {
          eyebrow: "Última reunión",
          title: "La última reunión, disponible ahora.",
          description: "Mirá la transmisión más reciente de Manantial de Avivamiento.",
          tone: "light",
        }
      : {
          eyebrow: "Próxima transmisión",
          title: "Volvemos en la próxima reunión.",
          description: "No hay una transmisión activa ahora. Te esperamos en el próximo encuentro o en nuestro canal de YouTube.",
          tone: "light",
        };
  const isLive = state.tone === "dark";

  return (
    <>
      <section className={isLive ? "bg-ink py-16 text-white sm:py-20" : "bg-canvas py-16 text-ink sm:py-20"}>
        <div className="section">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <p className={isLive ? "eyebrow !text-white/60" : "eyebrow"}>{state.eyebrow}</p>
              <CultoBadge status={transmissionStatus} />
            </div>
            <h1 className="mt-5 font-display font-display-emphasis text-5xl font-semibold tracking-normal sm:text-6xl">
              {state.title}
            </h1>
            <p className={isLive ? "mt-5 max-w-2xl text-white/65" : "mt-5 max-w-2xl text-ink/65"}>
              {state.description}
            </p>
          </div>

          <div className={isLive ? "mt-10 border-y border-white/15 py-6 sm:py-8" : "mt-10 border-y border-ink/10 py-6 sm:py-8"}>
            <CultoPlayer status={transmissionStatus} />
          </div>

          <div className="mt-7 flex flex-wrap gap-4">
            <ExternalButtonLink href={churchInfo.social.youtube} variant={isLive ? "onair" : "secondary"} tone={isLive ? "dark" : "light"}>
              Ver canal de YouTube
            </ExternalButtonLink>
            <ButtonLink href="/reuniones" variant="secondary" tone={isLive ? "dark" : "light"}>
              Ver horarios
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section">
          <p className="eyebrow">Próximas transmisiones</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-normal sm:text-4xl">
            {nextTransmission ? "Cuándo volvemos a encontrarnos" : "Seguinos para próximos anuncios"}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-copy">
            {nextTransmission
              ? "Estas reuniones están previstas para transmitirse por YouTube. Los horarios pueden actualizarse desde la agenda de la iglesia."
              : "Los próximos encuentros transmitidos se anuncian en nuestro canal de YouTube y en la agenda de la iglesia."}
          </p>

          {upcomingTransmissions.length > 0 && (
            <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3" data-stagger>
              {upcomingTransmissions.map((transmission) => (
                <div key={`${transmission.title}-${transmission.startsAt}`} className="border-t border-ink/10 pt-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-dark">YouTube</p>
                  <p className="mt-3 font-display text-xl font-semibold text-ink">{transmission.title}</p>
                  <p className="mt-2 text-sm font-medium text-copy">{transmission.detail}</p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-10 border-t border-ink/10 pt-6">
            <ButtonLink href="/reuniones" variant="secondary">Ver agenda completa</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

function toBuenosAiresTimestamp(
  date: { year: number; month: number; day: number },
  time?: string
) {
  const match = time?.match(/(\d{1,2}):(\d{2})/);
  const hours = match ? Number(match[1]) : 23;
  const minutes = match ? Number(match[2]) : 59;

  return Date.UTC(date.year, date.month - 1, date.day, hours + 3, minutes);
}
