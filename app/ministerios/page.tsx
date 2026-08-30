import type { Metadata } from "next";
import { getMinistries } from "@/lib/data";
import MinistryCard from "@/components/ministry-card";
import MinistryCategoryNav from "@/components/ministry-category-nav";
import { ButtonLink } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Ministerios",
  description:
    "Conocé las áreas ministeriales de la iglesia: jóvenes, adolescentes, años dorados, IBE, escuela de vida, escuela bíblica, evangelismo y GDI.",
};

export default async function MinisteriosPage() {
  const ministries = await getMinistries();
  const groups = [
    {
      id: "life-stage",
      title: "Por etapa de vida",
      description: "Espacios para niños, jóvenes, adolescentes y adultos mayores.",
    },
    {
      id: "formation",
      title: "Para crecer en la fe",
      description: "Formación y acompañamiento para profundizar en la Palabra.",
    },
    {
      id: "community",
      title: "Para conectar",
      description: "Una comunidad más cercana, reunida en hogares.",
    },
    {
      id: "serve",
      title: "Para servir",
      description: "La fe en acción, dentro y fuera de nuestras paredes.",
    },
  ] as const;

  return (
    <section className="section py-20 sm:py-24">
      <p className="eyebrow">Vida en comunidad</p>
      <h1 className="mt-4 max-w-2xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
        Un lugar para cada etapa de tu vida
      </h1>
      <p className="mt-6 max-w-2xl text-ink/65">
        Un espacio para crecer, conectar y servir junto a otros.
      </p>
      <p className="mt-10 text-sm font-medium text-copy">Busco un espacio para:</p>
      <MinistryCategoryNav />

      <div className="mt-14 space-y-16 sm:space-y-20">
        {groups.map((group) => {
          const groupMinistries = ministries.filter((ministry) => ministry.category === group.id);
          if (groupMinistries.length === 0) return null;

          return (
            <section key={group.id} id={`ministerios-${group.id}`} className="scroll-mt-24">
              <p className="eyebrow">{group.title}</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-copy">{group.description}</p>
              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-stagger>
                {groupMinistries.map((ministry) => (
                  <MinistryCard key={ministry.slug} ministry={ministry} variant="light" />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <section className="mt-16 border-y border-ink/10 py-8 sm:mt-20 sm:flex sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p className="eyebrow">Te ayudamos a encontrar tu lugar</p>
          <h2 className="mt-3 font-display text-2xl font-semibold text-ink">¿No sabés cuál es para vos?</h2>
          <p className="mt-3 text-sm leading-relaxed text-copy">Contanos en qué etapa estás y te ayudamos a encontrar un espacio.</p>
        </div>
        <ButtonLink href="/contacto?topic=Ministerios%20o%20GDI" variant="secondary" className="mt-6 sm:mt-0">
          Hablar con la iglesia
        </ButtonLink>
      </section>
    </section>
  );
}
