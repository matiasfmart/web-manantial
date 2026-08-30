"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import type { ChurchInfo } from "@/lib/data";
import { SocialBrandIcon } from "./social-icons";
import { BadgeDot } from "./ui/badge";
import { ButtonLink } from "./ui/button";
import { InteractiveLink } from "./ui/interactive-link";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/ministerios", label: "Ministerios" },
  { href: "/reuniones", label: "Reuniones" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header({ churchInfo }: { churchInfo: ChurchInfo }) {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();

  const closeMenu = () => {
    if (!open || isClosing) return;
    setIsClosing(true);
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
      menuButtonRef.current?.focus();
    }, 240);
  };

  const openMenu = () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    setIsClosing(false);
    setOpen(true);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const focusableSelector = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
    const main = document.querySelector("main");
    const footer = document.querySelector("footer");
    const background = [main, footer].filter((element): element is HTMLElement => Boolean(element));

    document.body.style.overflow = "hidden";
    background.forEach((element) => {
      element.inert = true;
      element.setAttribute("aria-hidden", "true");
    });
    firstMenuLinkRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        return;
      }

      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      background.forEach((element) => {
        element.inert = false;
        element.removeAttribute("aria-hidden");
      });
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, isClosing]);

  useEffect(() => () => {
    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
  }, []);

  const isMenuMounted = open || isClosing;

  return (
    <header className={`sticky top-0 z-50 border-b bg-[#f7f7f4] text-ink transition-[border-color,background-color] duration-[220ms] ${scrolled ? "border-ink/20" : "border-ink/10"}`}>
      <div className={`section flex items-center justify-between gap-3 py-2 transition-[height] duration-[220ms] ${scrolled ? "h-14 sm:h-16" : "h-16 sm:h-[68px]"}`}>
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink" onClick={() => setOpen(false)}>
          <Image
            src={churchInfo.logoColor}
            alt={churchInfo.name}
            width={40}
            height={40}
            priority
            className={`transition-[width,height] duration-[220ms] ${scrolled ? "h-9 w-9 sm:h-10 sm:w-10" : "h-10 w-10 sm:h-11 sm:w-11"}`}
          />
          <span className="block min-w-0 font-display font-display-emphasis text-[12px] font-semibold leading-[1.1] tracking-normal text-ink min-[360px]:text-sm sm:text-base">
            <span className="block lg:hidden">Manantial de<br />Avivamiento</span>
            <span className="hidden truncate lg:block">{churchInfo.name}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <InteractiveLink
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition hover:text-brand ${
                pathname === link.href ? "link-underline-active text-brand" : "text-ink/65"
              }`}
            >
              {link.label}
            </InteractiveLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ButtonLink href="/en-vivo" variant="onair" size="sm">
            <BadgeDot tone="onair" pulse />
            En vivo
          </ButtonLink>
          <ButtonLink href="/ofrendas" variant="primary" size="sm">
            Ofrendar
          </ButtonLink>
        </div>

        <div className="flex shrink-0 items-center lg:hidden">
          <button
          ref={menuButtonRef}
          className="relative flex h-11 w-11 items-center justify-center border border-ink/20 bg-transparent transition duration-200 hover:border-ink/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink active:scale-[0.98]"
          onClick={() => (open ? closeMenu() : openMenu())}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
        >
          <span className="sr-only">{open ? "Cerrar menú" : "Abrir menú"}</span>
          <span
            className={`absolute h-px w-5 bg-ink transition duration-[220ms] ${
              open ? "translate-y-0 rotate-45" : "-translate-y-2"
            }`}
          />
          <span
            className={`absolute h-px w-5 bg-ink transition duration-[220ms] ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute h-px w-5 bg-ink transition duration-[220ms] ${
              open ? "translate-y-0 -rotate-45" : "translate-y-2"
            }`}
          />
          </button>
        </div>
      </div>

      {isMenuMounted && (
        <nav ref={menuRef} id="mobile-navigation" aria-label="Navegación principal" className={`fixed inset-x-0 top-16 z-40 max-h-[calc(100svh-4rem)] overflow-y-auto border-t border-white/10 bg-ink sm:top-[68px] lg:hidden ${isClosing ? "animate-[panelOut_240ms_cubic-bezier(0.22,1,0.36,1)_forwards]" : "animate-[panelIn_320ms_cubic-bezier(0.22,1,0.36,1)]"}`}>
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
                  ref={index === 0 ? firstMenuLinkRef : undefined}
                  onClick={closeMenu}
                  className={`group flex translate-y-3 items-center justify-between border-b border-white/10 py-4 opacity-0 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-onair ${
                    pathname === link.href
                      ? "text-brand-light"
                      : "text-white hover:text-brand-light"
                  }`}
                  style={{ animation: `revealUp 380ms cubic-bezier(0.22, 1, 0.36, 1) ${100 + index * 45}ms forwards` }}
                >
                  <span className="flex items-center gap-4">
                    <span className="w-6 text-xs font-semibold text-white/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-2xl font-bold uppercase tracking-normal">
                      {link.label}
                    </span>
                  </span>
                  <span className="text-white/40 transition group-focus-visible:translate-x-1 group-focus-visible:text-brand-light">
                    →
                  </span>
                </Link>
              ))}
              <ButtonLink
                href="/primera-vez"
                onClick={closeMenu}
                variant="secondary"
                tone="dark"
                size="sm"
                className="mt-5 w-full"
              >
                ¿Es tu primera vez?
              </ButtonLink>
            </div>

            <div className="mt-auto border-t border-white/10 pt-5">
              <div className="grid grid-cols-2 gap-2">
              <ButtonLink href="/en-vivo" onClick={closeMenu} variant="onair" tone="dark" className="px-4 py-3 text-sm">
                <BadgeDot tone="onair" pulse />
                En vivo
              </ButtonLink>
              <ButtonLink href="/ofrendas" onClick={closeMenu} variant="primary" tone="dark" className="px-4 py-3 text-sm">
                Ofrendar
              </ButtonLink>
              </div>

              <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href={churchInfo.prayerRequest.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold uppercase tracking-wide text-white/55 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-onair"
                >
                  Pedí oración
                </a>
                <div className="flex items-center gap-3 text-white/55">
                  <a href={churchInfo.whatsappChannelUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-brand-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-onair">
                    <SocialBrandIcon platform="whatsapp" />
                  </a>
                  <a href={churchInfo.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-brand-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-onair">
                    <SocialBrandIcon platform="instagram" />
                  </a>
                  <a href={churchInfo.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="hover:text-brand-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-onair">
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
