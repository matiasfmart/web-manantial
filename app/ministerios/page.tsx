import type { Metadata } from "next";
import { ministries } from "@/lib/data";
import MinistryCard from "@/components/ministry-card";

export const metadata: Metadata = {
  title: "Ministerios",
  description:
    "Conocé las áreas ministeriales de la iglesia: jóvenes, adolescentes, años dorados, IBE, escuela de vida, escuela bíblica, evangelismo y GDI.",
};

export default function MinisteriosPage() {
  return (
    <section className="section py-28">
      <p className="eyebrow">Vida en comunidad</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
        Un lugar para cada etapa de tu vida
      </h1>
      <p className="mt-6 max-w-2xl text-white/60">
        Creemos que la iglesia es familia. Por eso tenemos un espacio pensado
        para cada edad y cada momento: desde los más chicos hasta nuestros
        hermanos mayores.
      </p>

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ministries.map((m) => (
          <MinistryCard key={m.slug} ministry={m} />
        ))}
      </div>
    </section>
  );
}
