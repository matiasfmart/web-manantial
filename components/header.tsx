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
import type { TransmissionStatus } from "@/lib/youtube";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/reuniones", label: "Agenda" },
  { href: "/ministerios", label: "Ministerios" },
  { href: "/radio", label: "Radio" },
  { href: "/nosotros", label: "Nosotros" },
  { href: "/contacto", label: "Contacto" },
];
const firstVisit = { href: "/primera-vez", label: "¿Es tu primera vez?", prompt: "Empezá acá" };

export default function Header({
  churchInfo,
}: {
  churchInfo: ChurchInfo;
}) {
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [transmissionStatus, setTransmissionStatus] = useState<TransmissionStatus>({ kind: "unavailable" });
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
    requestAnimationFrame(() => menuRef.current?.scrollTo({ top: 0 }));
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 36);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const refreshTransmissionStatus = async () => {
      try {
        const response = await fetch("/api/transmision", { cache: "no-store" });
        if (!response.ok) return;
        const status = (await response.json()) as TransmissionStatus;
        if (isMounted) setTransmissionStatus(status);
      } catch {
        // The neutral YouTube action remains available if the status refresh fails.
      }
    };

    refreshTransmissionStatus();
    const interval = window.setInterval(refreshTransmissionStatus, 60_000);
    return () => {
      isMounted = false;
      window.clearInterval(interval);
    };
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
      const focusable = [
        menuButtonRef.current,
        ...Array.from(menuRef.current.querySelectorAll<HTMLElement>(focusableSelector)),
      ].filter((element): element is HTMLElement => Boolean(element));
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
    <header className={`sticky top-0 z-50 border-b bg-[#f7f7f4] text-ink transition-[border-color,background-color] duration-[220ms] ${scrolled ? "border-ink/15" : "border-ink/10"}`}>
      <div className="section flex h-16 items-center gap-3 py-2">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink" onClick={() => setOpen(false)}>
          <Image
            src={churchInfo.logoColor}
            alt={churchInfo.name}
            width={40}
            height={40}
            priority
            className="h-10 w-10 transition-[width,height] duration-[220ms] sm:h-11 sm:w-11 xl:h-9 xl:w-9"
          />
          <span className="block min-w-0 font-display font-display-emphasis text-[12px] font-semibold leading-[1.1] tracking-normal text-ink min-[360px]:text-sm sm:text-base xl:text-[15px]">
            <span className="block xl:hidden">Manantial de<br />Avivamiento</span>
            <span className="hidden truncate xl:block">{churchInfo.shortName}</span>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-3 xl:flex">
          <InteractiveLink
            href={firstVisit.href}
            className="whitespace-nowrap text-sm font-semibold text-brand-dark hover:text-ink"
          >
            {firstVisit.label} <span className="text-ink/45">{firstVisit.prompt}</span>
          </InteractiveLink>
          {transmissionStatus.kind === "live" ? (
            <ButtonLink href="/en-vivo" variant="onair" size="sm" className="!min-h-8">
              <BadgeDot tone="onair" pulse />
              En vivo
            </ButtonLink>
          ) : (
            <ButtonLink href="/en-vivo" variant="secondary" size="sm" className="!min-h-8">
              {transmissionStatus.kind === "latest" ? "Última reunión" : "YouTube"}
            </ButtonLink>
          )}
          <ButtonLink href="/ofrendas" variant="primary" size="sm" className="!min-h-8">
            Ofrendar
          </ButtonLink>
        </div>

        <div className="ml-auto flex shrink-0 items-center xl:hidden">
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

      <div className={`hidden border-y bg-white transition-colors duration-[200ms] xl:block ${scrolled ? "border-ink/15" : "border-ink/10"}`}>
        <div className="section flex h-10 items-center gap-7">
          {links.map((link) => (
            <InteractiveLink
              key={link.href}
              href={link.href}
              className={`text-sm font-medium tracking-wide transition-colors duration-[200ms] hover:text-brand ${
                pathname === link.href ? "link-underline-active text-brand" : scrolled ? "text-ink/75" : "text-ink/60"
              }`}
            >
              {link.label}
            </InteractiveLink>
          ))}
        </div>
      </div>

      {isMenuMounted && (
        <nav ref={menuRef} id="mobile-navigation" aria-label="Navegación principal" className={`fixed left-0 top-16 z-40 h-[calc(100svh-4rem)] w-screen overflow-y-auto border-t border-white/10 bg-ink xl:hidden ${isClosing ? "animate-[panelOut_240ms_cubic-bezier(0.22,1,0.36,1)_forwards]" : "animate-[panelIn_320ms_cubic-bezier(0.22,1,0.36,1)]"}`}>
          <div className="section flex min-h-full flex-col py-6">
            <div className="border-b border-white/10 pb-6">
              <p className="font-display text-2xl font-black uppercase tracking-normal">
                Manantial de Avivamiento
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                Villa Lugano · CABA
              </p>
            </div>

            <div className="border-b border-brand/45 py-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-light">¿Es tu primera vez?</p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">Te contamos horarios, cómo llegar y qué esperar.</p>
              <ButtonLink
                href={firstVisit.href}
                onClick={closeMenu}
                variant="secondary"
                tone="dark"
                size="sm"
                className="mt-4 w-full border-brand/60 text-white hover:border-brand-light"
              >
                {firstVisit.prompt}
              </ButtonLink>
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
            </div>

            <div className="mt-auto border-t border-white/10 pt-5">
              <div className="grid grid-cols-2 gap-2">
              {transmissionStatus.kind === "live" ? (
                <ButtonLink href="/en-vivo" onClick={closeMenu} variant="onair" tone="dark" className="px-4 py-3 text-sm">
                  <BadgeDot tone="onair" pulse />
                  En vivo
                </ButtonLink>
              ) : (
                <ButtonLink href="/en-vivo" onClick={closeMenu} variant="secondary" tone="dark" className="px-4 py-3 text-sm">
                  {transmissionStatus.kind === "latest" ? "Última reunión" : "YouTube"}
                </ButtonLink>
              )}
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
