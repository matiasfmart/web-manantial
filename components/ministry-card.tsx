import Image from "next/image";
import Link from "next/link";
import MinistryIcon from "./ministry-icon";
import type { Ministry } from "@/lib/data";

export default function MinistryCard({ ministry }: { ministry: Ministry }) {
  return (
    <Link
      href={`/ministerios/${ministry.slug}`}
      className="group flex h-full flex-col border-t border-white/15 pt-4 transition hover:border-brand/50"
    >
      <div className="relative h-44 w-full overflow-hidden bg-surface sm:h-48">
        <Image
          src={ministry.image}
          alt={ministry.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover opacity-85 transition duration-500 group-hover:scale-[1.03]"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t ${ministry.color} opacity-30 mix-blend-multiply`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/10 to-transparent" />
        <div
          className={`absolute left-4 top-4 flex h-10 w-10 items-center justify-center bg-gradient-to-br ${ministry.color} text-white`}
        >
          <MinistryIcon icon={ministry.icon} />
        </div>
      </div>

      <div className="flex flex-1 flex-col py-5">
        <h3 className="font-display text-xl font-bold uppercase tracking-normal">
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
          <span className="text-brand-light opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100">
            Ver más →
          </span>
        </div>
      </div>
    </Link>
  );
}

