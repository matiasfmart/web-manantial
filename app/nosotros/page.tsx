import type { Metadata } from "next";
import Link from "next/link";
import { churchInfo, pastoralTeam } from "@/lib/data";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Conocé la historia, visión y misión de Ministerio Manantial de Avivamiento, en el ex Cine Progreso de Villa Lugano.",
};

export default function NosotrosPage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-surface py-28">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-brand/25 blur-[120px]" />
        <div className="section relative">
          <p className="eyebrow">Nuestra historia</p>
          <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
            Del cine de barrio a casa de fe
          </h1>
          <p className="mt-6 max-w-2xl text-white/60">
            {churchInfo.name} funciona en el histórico edificio conocido por
            todo Villa Lugano como el {churchInfo.historicNote.replace(/^Conocido en el barrio de Lugano como el /, "")}.
            Un espacio que antes reunía vecinos para ver películas, hoy los
            reúne para encontrarse con Dios.
          </p>
        </div>
      </section>

      <section className="section grid grid-cols-1 gap-10 py-24 lg:grid-cols-3">
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
      <section className="bg-white py-24 text-ink">
        <div className="section">
          <p className="eyebrow !text-brand">Liderazgo</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-bold uppercase tracking-normal sm:text-4xl">
            Nuestro equipo pastoral
          </h2>
          <p className="mt-4 max-w-xl text-ink/60">
            Un equipo comprometido con acompañar a cada familia y cada
            ministerio de la iglesia, en cada etapa de la vida.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pastoralTeam.map((member) => (
              <div
                key={member.names.join("-")}
                className="flex items-center gap-4 rounded-2xl border border-ink/10 bg-surface2/[0.03] p-5"
              >
                <div className="flex -space-x-3">
                  {member.names.map((name) => (
                    <div
                      key={name}
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-brand to-brand-dark text-sm font-bold text-white"
                    >
                      {initials(name)}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold leading-tight">
                    {member.names.join(" y ")}
                  </p>
                  <p className="text-xs uppercase tracking-wide text-ink/40">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section py-24 text-center">
        <Link href="/contacto" className="btn-primary">
          Quiero saber más
        </Link>
      </section>
    </>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .filter((part) => part.length > 2)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function ValueCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="card p-8">
      <h3 className="font-display text-2xl font-bold uppercase tracking-normal text-brand-light">
        {title}
      </h3>
      <p className="mt-4 leading-relaxed text-white/60">{text}</p>
    </div>
  );
}

