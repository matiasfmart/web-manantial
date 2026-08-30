import Image from "next/image";
import Link from "next/link";
import MinistryIcon from "./ministry-icon";
import type { Ministry } from "@/lib/data";

export default function MinistryCard({
  ministry,
  variant = "dark",
}: {
  ministry: Ministry;
  variant?: "dark" | "light";
}) {
  const isLight = variant === "light";

  return (
    <Link
      href={`/ministerios/${ministry.slug}`}
      className={`group flex h-full flex-col border-t pt-4 transition duration-300 hover:-translate-y-1 hover:border-ink/40 ${
        isLight ? "border-ink/15" : "border-white/15"
      }`}
    >
      <div className="relative h-44 w-full overflow-hidden bg-surface sm:h-48">
        <Image
          src={ministry.image}
          alt={ministry.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover opacity-85 transition duration-700 group-hover:scale-[1.04]"
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
        <h3
          className={`font-display font-display-emphasis text-xl font-bold uppercase tracking-normal ${
            isLight ? "text-ink" : "text-white"
          }`}
        >
          {ministry.name}
        </h3>
        <p className={`mt-1 text-sm font-medium ${isLight ? "text-copy" : "text-white/65"}`}>
          {ministry.tagline}
        </p>
        <p className={`mt-3 flex-1 text-sm leading-relaxed ${isLight ? "text-ink/60" : "text-white/60"}`}>
          {ministry.description}
        </p>
        <div
          className={`mt-5 flex items-center justify-between border-t pt-4 text-xs ${
            isLight ? "border-ink/10" : "border-white/10"
          }`}
        >
          <span className={`font-semibold uppercase tracking-wide ${isLight ? "text-ink/70" : "text-white/70"}`}>
            {ministry.schedule}
          </span>
          <span
            className={`opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100 ${
              isLight ? "text-ink" : "text-white"
            }`}
          >
            Ver más →
          </span>
        </div>
      </div>
    </Link>
  );
}

