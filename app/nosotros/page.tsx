import type { Metadata } from "next";
import Image from "next/image";
import { getChurchInfo, getPastoralTeam } from "@/lib/data";
import { ButtonLink } from "@/components/ui/button";

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
            Del cine de barrio a casa de fe
          </h1>
          <p className="mt-6 max-w-2xl text-ink/65">
            {churchInfo.name} funciona en el histórico edificio conocido por
            todo Villa Lugano como el {churchInfo.historicNote.replace(/^Conocido en el barrio de Lugano como el /, "")}.
            Un espacio que antes reunía vecinos para ver películas, hoy los
            reúne para encontrarse con Dios.
          </p>
        </div>
      </section>

      <section className="section grid grid-cols-1 gap-6 py-16 sm:py-20 lg:grid-cols-3" data-stagger>
        <ValueCard
          title="Visión"
          text="Ser una iglesia que alcanza cada generación, dentro y fuera de sus paredes, con el amor y la Palabra de Dios."
        />
        <ValueCard
          title="Misión"
          text="Formar discípulos comprometidos con Cristo a través de la adoración, la enseñanza bíblica, la comunidad y el servicio."
        />
        <ValueCard
          title="Valores"
          text="Fe genuina, familia, excelencia, servicio a la comunidad y una adoración que trasciende las cuatro paredes del auditorio."
        />
      </section>

      {/* PASTORADO */}
      <section className="bg-white py-20 text-ink">
        <div className="section">
          <div className="max-w-2xl">
            <p className="eyebrow">Acompañamiento pastoral</p>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
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
                className="group flex items-center gap-4 border-t border-ink/10 bg-white py-4 transition hover:border-ink/35 sm:px-4"
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

      <section className="section py-16 text-center">
        <ButtonLink href="/contacto" variant="primary">
          Quiero saber más
        </ButtonLink>
      </section>
    </>
  );
}

function ValueCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="border-t border-ink/15 pt-6">
      <h3 className="font-display text-2xl font-semibold tracking-normal text-ink">
        {title}
      </h3>
      <p className="mt-4 leading-relaxed text-ink/65">{text}</p>
    </div>
  );
}

