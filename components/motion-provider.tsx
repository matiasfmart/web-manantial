"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = [
  "main > section",
  "main article > section",
  "footer",
  "[data-reveal]",
  "[data-stagger]",
].join(",");

export default function MotionProvider() {
  useEffect(() => {
    const elements = Array.from(new Set(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)));
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    elements.forEach((element) => {
      element.dataset.reveal = element.dataset.reveal || "section";
      element.classList.add("motion-pending");
    });

    const staggerGroups = Array.from(document.querySelectorAll<HTMLElement>("[data-stagger]"));
    staggerGroups.forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        if (child instanceof HTMLElement) {
          child.style.setProperty("--motion-delay", `${Math.min(index * 70, 420)}ms`);
        }
      });
    });

    if (prefersReducedMotion) {
      elements.forEach((element) => {
        element.classList.remove("motion-pending");
        element.classList.add("is-visible");
      });
      return;
    }

    const showElement = (element: Element) => {
      element.classList.remove("motion-pending");
      element.classList.add("is-visible");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            showElement(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -12%", threshold: 0.12 }
    );

    elements.forEach((element) => observer.observe(element));

    const fallback = window.setTimeout(() => {
      elements.forEach((element) => {
        if (!element.classList.contains("is-visible")) {
          showElement(element);
          observer.unobserve(element);
        }
      });
    }, 1800);

    return () => {
      window.clearTimeout(fallback);
      observer.disconnect();
    };
  }, []);

  return null;
}