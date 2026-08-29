import Image from "next/image";
import Link from "next/link";
import { churchInfo, ministries } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-surface pb-28 pt-16">
      <div className="section grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <Image src={churchInfo.logoColor} alt="" width={36} height={36} className="h-9 w-9" />
            <p className="font-display text-xl font-bold">{churchInfo.shortName}</p>
          </div>
          <p className="mt-3 text-sm text-white/50">{churchInfo.auditoriumName}</p>
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            {churchInfo.address}
          </p>
          <p className="mt-2 text-xs italic text-white/40">
            {churchInfo.historicNote}
          </p>
          <div className="mt-5 flex gap-3">
            <SocialIcon href={churchInfo.whatsappChannelUrl} label="WhatsApp" />
            <SocialIcon href={churchInfo.social.instagram} label="Instagram" />
            <SocialIcon href={churchInfo.social.youtube} label="YouTube" />
            <SocialIcon href={churchInfo.social.facebook} label="Facebook" />
            <SocialIcon href={churchInfo.social.tiktok} label="TikTok" />
          </div>
        </div>

        <div>
          <p className="eyebrow">Ministerios</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {ministries.slice(0, 5).map((m) => (
              <li key={m.slug}>
                <Link href={`/ministerios/${m.slug}`} className="hover:text-brand-light">
                  {m.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="eyebrow">Institución</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li><Link href="/primera-vez" className="hover:text-brand-light">¿Es tu primera vez?</Link></li>
            <li><Link href="/nosotros" className="hover:text-brand-light">Nosotros</Link></li>
            <li><Link href="/reuniones" className="hover:text-brand-light">Horarios de reunión</Link></li>
            <li><Link href="/en-vivo" className="hover:text-brand-light">En vivo (radio y culto)</Link></li>
            <li><Link href="/radio" className="hover:text-brand-light">Programación de radio</Link></li>
            <li><Link href="/contacto" className="hover:text-brand-light">Contacto</Link></li>
            <li><Link href="/ofrendas" className="hover:text-brand-light">Ofrendar</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow">Pedí oración</p>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            <li>{churchInfo.prayerRequest.mobile} (móvil)</li>
            <li>{churchInfo.prayerRequest.landline} (fijo)</li>
            <li>{churchInfo.email}</li>
          </ul>
          <a
            href={churchInfo.prayerRequest.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary mt-4 !py-2 !px-4 text-xs"
          >
            Escribir por WhatsApp
          </a>
          <p className="mt-6 text-xs text-white/40">
            © {new Date().getFullYear()} {churchInfo.name}. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition hover:border-brand hover:text-brand-light"
    >
      <span className="text-xs font-bold">{label[0]}</span>
    </a>
  );
}
