import type { Metadata } from "next";
import Image from "next/image";
import { getChurchInfo, getPastoralTeam } from "@/lib/data";
import { ButtonLink, ExternalButtonLink } from "@/components/ui/button";
import { InteractiveLink } from "@/components/ui/interactive-link";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conocé la historia, visión y misión de Ministerio Manantial de Avivamiento, en el ex Cine Progreso de Villa Lugano.",
};

export default async function NosotrosPage() {
  const [churchInfo, pastoralTeam] = await Promise.all([getChurchInfo(), getPastoralTeam()]);

  return (
    <>
      <section className="relative overflow-hidden border-b border-ink/10 bg-surface py-20 sm:py-24">
        <div className="section relative">
          <p className="eyebrow">Nuestra historia</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
            {churchInfo.about.historyTitle}
          </h1>
          <p className="mt-6 max-w-2xl text-ink/65">
            {churchInfo.about.historyText}
          </p>
          <div className="mt-8 border-y border-ink/15 py-5">
            <p className="font-display text-lg font-semibold text-ink">{churchInfo.auditoriumName}</p>
            <p className="mt-1 text-sm text-copy">{churchInfo.address}</p>
            <ExternalButtonLink
              href={`https://maps.google.com/?q=${encodeURIComponent(churchInfo.mapsQuery)}`}
              variant="secondary"
              size="sm"
              className="mt-5"
            >
              Cómo llegar
            </ExternalButtonLink>
          </div>
        </div>
      </section>

      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section">
          <div className="max-w-2xl">
            <p className="eyebrow">Lo que nos mueve</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal sm:text-4xl">Fe que se vive en comunidad</h2>
            <p className="mt-4 leading-relaxed text-copy">{churchInfo.about.communityStatement}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1fr_1.2fr]" data-stagger>
            <Principle title="Visión" text={churchInfo.about.vision} />
            <Principle title="Misión" text={churchInfo.about.mission} />
            <div className="border-t border-ink/15 pt-6">
              <h3 className="font-display text-2xl font-semibold text-ink">Valores</h3>
              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-medium text-carbon">
                {churchInfo.about.values.map((value) => <li key={value}>{value}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 text-ink sm:py-20">
        <div className="section">
          <div className="max-w-2xl">
            <p className="eyebrow">Acompañamiento pastoral</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal sm:text-4xl">
              Personas que sirven y acompañan
            </h2>
            <p className="mt-4 text-ink/60">
              Nuestro equipo pastoral acompaña la vida espiritual de la iglesia
              con oración, enseñanza y cuidado cercano.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-2" data-stagger>
            {pastoralTeam.map((member) => (
              <div
                key={member.displayName}
                className="group flex items-center gap-4 border-t border-ink/10 py-4 transition hover:border-ink/35 sm:px-4"
              >
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden bg-ink sm:h-28 sm:w-28">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.displayName}
                      fill
                      sizes="112px"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <>
                      <div className="fallback-breathe absolute inset-0 bg-gradient-to-br from-carbon via-ink to-black" />
                      <Image
                        src={churchInfo.logoColor}
                        alt=""
                        width={44}
                        height={44}
                        className="relative h-11 w-11"
                      />
                    </>
                  )}
                </div>
                <div className="h-16 w-px shrink-0 bg-gradient-to-b from-ink via-line to-transparent" />
                <div className="min-w-0 pr-2">
                  <p className="font-display text-lg font-bold uppercase leading-tight tracking-normal text-ink">
                    {member.displayName}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink/40">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink py-16 text-white sm:py-20">
        <div className="section max-w-3xl text-center">
          <p className="eyebrow !text-white/55">Conocenos en persona</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-normal sm:text-4xl">Te esperamos en el auditorio</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/65">Conocé la comunidad, participá de una reunión y encontrá un espacio para crecer junto a otros.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/reuniones" variant="primary" tone="dark">Ver horarios de reunión</ButtonLink>
            <ButtonLink href="/ministerios" variant="secondary" tone="dark">Conocé los ministerios</ButtonLink>
          </div>
          <InteractiveLink href="/contacto" className="mt-6 inline-block text-sm text-white/70 hover:text-white">Cómo llegar al auditorio</InteractiveLink>
        </div>
      </section>
    </>
  );
}

function Principle({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-ink/15 pt-6">
      <h3 className="font-display text-2xl font-semibold tracking-normal text-ink">
        {title}
      </h3>
      <p className="mt-4 leading-relaxed text-ink/65">{text}</p>
    </div>
  );
}

