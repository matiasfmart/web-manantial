import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ministrySlugs, getMinistryBySlug } from "@/lib/data";
import MinistryIcon from "@/components/ministry-icon";

export function generateStaticParams() {
  return ministrySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ministry = await getMinistryBySlug(slug);
  if (!ministry) return {};
  return {
    title: ministry.name,
    description: ministry.description,
  };
}

export default async function MinistryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ministry = await getMinistryBySlug(slug);
  if (!ministry) notFound();

  return (
    <article>
      <section className="relative overflow-hidden border-b border-white/10 bg-surface py-20 sm:py-24">
        <Image
          src={ministry.image}
          alt={ministry.name}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/85 to-surface/40" />
        <div className="section relative">
          <Link href="/ministerios" className="text-sm text-white/50 hover:text-white">
            ← Todos los ministerios
          </Link>
          <div
            className={`mt-6 flex h-14 w-14 items-center justify-center bg-gradient-to-br ${ministry.color} text-white`}
          >
            <MinistryIcon icon={ministry.icon} className="h-8 w-8" />
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-black uppercase tracking-normal sm:text-6xl">
            {ministry.name}
          </h1>
          <p className="mt-4 text-lg font-medium text-brand-light">
            {ministry.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-4 text-sm">
            <span className="border border-white/15 px-4 py-2 font-semibold uppercase tracking-wide">
              {ministry.schedule}
            </span>
            <span className="border border-white/15 px-4 py-2 font-semibold uppercase tracking-wide text-white/70">
              {ministry.audience}
            </span>
          </div>
          {ministry.scheduleNote && (
            <p className="mt-4 max-w-xl text-sm italic text-white/50">
              {ministry.scheduleNote}
            </p>
          )}
        </div>
      </section>

      <section className="bg-white py-16 text-ink sm:py-20">
        <div className="section grid grid-cols-1 gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {ministry.longDescription.map((p, i) => (
              <p key={i} className="mb-6 leading-relaxed text-ink/70">
                {p}
              </p>
            ))}

            {ministry.image2 && (
              <div className="relative mb-8 mt-2 h-72 w-full overflow-hidden border border-ink/10 sm:h-96">
                <Image
                  src={ministry.image2}
                  alt={`${ministry.name} — foto 2`}
                  fill
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                />
              </div>
            )}

            {ministry.subMinistry && (
              <div className="mt-10 border-y border-ink/10 py-6">
                {ministry.subMinistry.image && (
                  <div className="relative mb-6 h-56 w-full overflow-hidden">
                    <Image
                      src={ministry.subMinistry.image}
                      alt={ministry.subMinistry.name}
                      fill
                      sizes="(min-width: 1024px) 66vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="eyebrow !text-brand">Dentro de este ministerio</p>
                  <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-normal">
                    {ministry.subMinistry.name}
                  </h2>
                  <p className="mt-2 text-sm font-semibold text-brand">
                    {ministry.subMinistry.schedule}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-ink/60">
                    {ministry.subMinistry.description}
                  </p>
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit border-y border-ink/10 py-6 lg:border-l lg:border-y-0 lg:py-0 lg:pl-8">
            <p className="eyebrow !text-brand">
              {ministry.isOutreach ? "Sumate a colaborar" : "¿Querés sumarte?"}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              {ministry.isOutreach
                ? "Si querés colaborar con recursos o tu tiempo para esta obra, contactanos."
                : "Contactanos y te ayudamos a dar el primer paso en este ministerio."}
            </p>
            <Link href="/contacto" className="btn-primary mt-6 w-full">
              Contactar a la iglesia
            </Link>
            <Link
              href="/reuniones"
              className="mt-3 inline-flex w-full items-center justify-center gap-2 border border-ink/20 bg-transparent px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-ink transition hover:border-ink/40 hover:bg-ink/5"
            >
              Ver todos los horarios
            </Link>
          </aside>
        </div>
      </section>
    </article>
  );
}

