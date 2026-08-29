"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { churchInfo } from "@/lib/data";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/ministerios", label: "Ministerios" },
  { href: "/reuniones", label: "Reuniones" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-ink/90 backdrop-blur-md">
      <div className="section flex h-16 items-center justify-between gap-4 py-2">
        <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setOpen(false)}>
          <Image
            src={churchInfo.logoColor}
            alt={churchInfo.name}
            width={40}
            height={40}
            priority
            className="h-8 w-8"
          />
          <span className="hidden max-w-44 truncate font-display text-sm font-bold uppercase tracking-normal sm:inline xl:max-w-none">
            {churchInfo.shortName}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium uppercase tracking-wide transition hover:text-brand-light ${
                pathname === link.href ? "text-brand-light" : "text-white/80"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/en-vivo"
            className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:border-white/40 hover:bg-white/10 active:scale-95"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            En vivo
          </Link>
          <Link
            href="/ofrendas"
            className="inline-flex items-center justify-center bg-brand px-5 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-brand-light active:scale-95"
          >
            Ofrendar
          </Link>
        </div>

        <button
          className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/15 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menú"
          aria-expanded={open}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-ink lg:hidden">
          <div className="section flex flex-col gap-1 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`border-b border-white/10 px-1 py-3 text-sm font-semibold uppercase tracking-wide transition ${
                  pathname === link.href
                    ? "text-brand-light"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-4">
              <Link
                href="/en-vivo"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white active:scale-95"
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
                className="flex w-full items-center justify-center bg-brand px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white active:scale-95"
              >
                Ofrendar
              </Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
