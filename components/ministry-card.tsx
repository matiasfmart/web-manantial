import Image from "next/image";
import Link from "next/link";
import MinistryIcon from "./ministry-icon";
import type { Ministry } from "@/lib/data";

export default function MinistryCard({ ministry }: { ministry: Ministry }) {
  return (
    <Link
      href={`/ministerios/${ministry.slug}`}
      className="group card flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:border-white/25"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={ministry.image}
          alt={ministry.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${ministry.color} opacity-30 mix-blend-multiply`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
        <div
          className={`absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${ministry.color} text-white shadow-glow`}
        >
          <MinistryIcon icon={ministry.icon} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl font-bold tracking-normal">
          {ministry.name}
        </h3>
        <p className="mt-1 text-sm font-medium text-brand-light">{ministry.tagline}</p>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">
          {ministry.description}
        </p>
        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-xs">
          <span className="font-semibold uppercase tracking-wide text-white/70">
            {ministry.schedule}
          </span>
          <span className="text-brand-light opacity-0 transition group-hover:opacity-100">
            Ver más →
          </span>
        </div>
      </div>
    </Link>
  );
}

