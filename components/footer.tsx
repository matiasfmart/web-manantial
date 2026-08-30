import Image from "next/image";
import Link from "next/link";
import type { ChurchInfo, Ministry } from "@/lib/data";
import { SocialBrandIcon, SocialCircleLink } from "./social-icons";
import { ExternalButtonLink } from "./ui/button";

export default function Footer({
  churchInfo,
  ministries,
}: {
  churchInfo: ChurchInfo;
  ministries: Ministry[];
}) {
  return (
    <footer className="border-t border-white/10 bg-ink pb-28 pt-16 text-white">
      <div className="section grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src={churchInfo.logoColor} alt="" width={36} height={36} className="h-9 w-9" />
            <p className="font-display text-xl font-semibold">{churchInfo.shortName}</p>
          </div>
          <p className="mt-3 text-sm text-white/60">{churchInfo.auditoriumName}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/70">
            {churchInfo.address}
          </p>
          <p className="mt-2 text-xs italic text-white/45">
            {churchInfo.historicNote}
          </p>
          <div className="mt-5 flex gap-3">
            <SocialCircleLink href={churchInfo.whatsappChannelUrl} label="WhatsApp" platform="whatsapp" />
            <SocialCircleLink href={churchInfo.social.instagram} label="Instagram" platform="instagram" />
            <SocialCircleLink href={churchInfo.social.youtube} label="YouTube" platform="youtube" />
            <SocialCircleLink href={churchInfo.social.facebook} label="Facebook" platform="facebook" />
            <SocialCircleLink href={churchInfo.social.tiktok} label="TikTok" platform="tiktok" />
          </div>
        </div>

        <div>
          <p className="eyebrow">Ministerios</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {ministries.slice(0, 5).map((m) => (
              <li key={m.slug}>
                <Link href={`/ministerios/${m.slug}`} className="link-underline hover:text-white">
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Institución</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link href="/primera-vez" className="link-underline hover:text-white">¿Es tu primera vez?</Link></li>
            <li><Link href="/nosotros" className="link-underline hover:text-white">Nosotros</Link></li>
            <li><Link href="/reuniones" className="link-underline hover:text-white">Horarios de reunión</Link></li>
            <li><Link href="/en-vivo" className="link-underline hover:text-white">En vivo</Link></li>
            <li><Link href="/radio" className="link-underline hover:text-white">Programación de radio</Link></li>
            <li><Link href="/contacto" className="link-underline hover:text-white">Contacto</Link></li>
            <li><Link href="/ofrendas" className="link-underline hover:text-white">Ofrendar</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Pedí oración</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>{churchInfo.prayerRequest.mobile} (móvil)</li>
            <li>{churchInfo.prayerRequest.landline} (fijo)</li>
            <li>{churchInfo.email}</li>
          </ul>
          <ExternalButtonLink
            href={churchInfo.prayerRequest.whatsappLink}
            variant="secondary"
            tone="dark"
            size="sm"
            className="mt-4"
          >
            <SocialBrandIcon platform="whatsapp" />
            Escribir por WhatsApp
          </ExternalButtonLink>
          <p className="mt-6 text-xs text-white/45">
            © {new Date().getFullYear()} {churchInfo.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
