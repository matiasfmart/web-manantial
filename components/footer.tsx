import Image from "next/image";
import type { ChurchInfo, Ministry } from "@/lib/data";
import { SocialBrandIcon, SocialCircleLink } from "./social-icons";
import { ExternalButtonLink } from "./ui/button";
import { InteractiveLink } from "./ui/interactive-link";

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
                <InteractiveLink href={`/ministerios/${m.slug}`} className="hover:text-white">
                  {m.name}
                </InteractiveLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Institución</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><InteractiveLink href="/primera-vez" className="hover:text-white">¿Es tu primera vez?</InteractiveLink></li>
            <li><InteractiveLink href="/nosotros" className="hover:text-white">Nosotros</InteractiveLink></li>
            <li><InteractiveLink href="/reuniones" className="hover:text-white">Horarios de reunión</InteractiveLink></li>
            <li><InteractiveLink href="/en-vivo" className="hover:text-white">En vivo</InteractiveLink></li>
            <li><InteractiveLink href="/radio" className="hover:text-white">Programación de radio</InteractiveLink></li>
            <li><InteractiveLink href="/contacto" className="hover:text-white">Contacto</InteractiveLink></li>
            <li><InteractiveLink href="/ofrendas" className="hover:text-white">Ofrendar</InteractiveLink></li>
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
