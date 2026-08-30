"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { ChurchInfo } from "@/lib/data";
import { SocialBrandIcon } from "./social-icons";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/ministerios", label: "Ministerios" },
  { href: "/reuniones", label: "Reuniones" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header({ churchInfo }: { churchInfo: ChurchInfo }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 border-b bg-[#f7f7f4] text-ink transition-[border-color,background-color] duration-300 ${scrolled ? "border-ink/20" : "border-ink/10"}`}>
      <div className={`section flex items-center justify-between gap-4 py-2 transition-[height] duration-300 ${scrolled ? "h-14 sm:h-16" : "h-16 sm:h-[68px]"}`}>
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <Image
            src={churchInfo.logoColor}
            alt={churchInfo.name}
            width={40}
            height={40}
            priority
            className={`transition-[width,height] duration-300 ${scrolled ? "h-9 w-9 sm:h-10 sm:w-10" : "h-10 w-10 sm:h-11 sm:w-11"}`}
          />
          <span className="block min-w-0 font-display text-sm font-semibold leading-tight tracking-normal text-ink sm:text-base">
            <span className="block truncate lg:hidden">{churchInfo.shortName}</span>
            <span className="hidden truncate lg:block">{churchInfo.name}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition hover:text-brand ${
                pathname === link.href ? "text-brand" : "text-ink/65"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/en-vivo"
            className="btn-secondary !px-4 !py-2 text-xs"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            En vivo
          </Link>
          <Link
            href="/ofrendas"
            className="inline-flex items-center justify-center bg-ink px-5 py-2 text-xs font-semibold text-white transition hover:bg-carbon active:scale-95"
          >
            Ofrendar
          </Link>
        </div>

        <button
          className="relative flex h-11 w-11 shrink-0 items-center justify-center border border-ink/15 bg-transparent transition hover:border-brand lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
        >
          <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
          <span
            className={`absolute h-px w-5 bg-ink transition duration-300 ${
              open ? "translate-y-0 rotate-45" : "-translate-y-2"
            }`}
          />
          <span
            className={`absolute h-px w-5 bg-ink transition duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-px w-5 bg-ink transition duration-300 ${
              open ? "translate-y-0 -rotate-45" : "translate-y-2"
            }`}
          />
        </button>
      </div>

      {open && (
        <nav className="fixed inset-x-0 top-16 z-40 max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 bg-ink animate-[panelIn_320ms_cubic-bezier(0.22,1,0.36,1)] sm:top-[68px] lg:hidden">
          <div className="section flex min-h-[calc(100svh-4rem)] flex-col py-6 sm:min-h-[calc(100svh-68px)]">
            <div className="border-b border-white/10 pb-6">
              <p className="font-display text-2xl font-black uppercase tracking-normal">
                Manantial de Avivamiento
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                Villa Lugano · CABA
              </p>
            </div>

            <div className="py-4">
              {links.map((link, index) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`group flex translate-y-3 items-center justify-between border-b border-white/10 py-4 opacity-0 transition ${
                    pathname === link.href
                      ? "text-brand-light"
                      : "text-white hover:text-brand-light"
                  }`}
                  style={{ animation: `revealUp 420ms cubic-bezier(0.22, 1, 0.36, 1) ${120 + index * 55}ms forwards` }}
                >
                  <span className="flex items-center gap-4">
                    <span className="w-6 text-xs font-semibold text-white/30">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-2xl font-bold uppercase tracking-normal">
                      {link.label}
                    </span>
                  </span>
                  <span className="text-white/25 transition group-hover:translate-x-1 group-hover:text-brand-light">
                    →
                  </span>
                </Link>
              ))}
            </div>

            <div className="mt-auto border-t border-white/10 pt-5">
              <div className="grid grid-cols-2 gap-2">
              <Link
                href="/en-vivo"
                onClick={() => setOpen(false)}
                className="btn-secondary-dark px-4 py-3 text-sm"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
                </span>
                En vivo
              </Link>
              <Link
                href="/ofrendas"
                onClick={() => setOpen(false)}
                className="btn-primary-dark px-4 py-3 text-sm"
              >
                Ofrendar
              </Link>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                <a
                  href={churchInfo.prayerRequest.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold uppercase tracking-wide text-white/55 hover:text-white"
                >
                  Pedí oración
                </a>
                <div className="flex items-center gap-3 text-white/55">
                  <a href={churchInfo.whatsappChannelUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-brand-light">
                    <SocialBrandIcon platform="whatsapp" />
                  </a>
                  <a href={churchInfo.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-brand-light">
                    <SocialBrandIcon platform="instagram" />
                  </a>
                  <a href={churchInfo.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-brand-light">
                    <SocialBrandIcon platform="youtube" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
