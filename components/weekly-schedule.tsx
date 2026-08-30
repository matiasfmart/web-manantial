"use client";

import { useState } from "react";
import type { GeneralService, ServiceAudience } from "@/lib/data";
import { getServiceLocation } from "@/lib/schedule";
import { BadgeDot, BadgeLink } from "./ui/badge";
import { InteractiveLink } from "./ui/interactive-link";

const days = ["Martes", "Miércoles", "Sábados", "Domingos"];
const audienceFilters: Array<{ value: "any" | ServiceAudience; label: string }> = [
  { value: "any", label: "Todas" },
  { value: "all", label: "Toda la iglesia" },
  { value: "children", label: "Niños" },
  { value: "teens", label: "Adolescentes" },
  { value: "youth", label: "Jóvenes" },
  { value: "formation", label: "Formación" },
  { value: "service", label: "Servicio" },
];

export default function WeeklySchedule({
  services,
  initialDay,
}: {
  services: GeneralService[];
  initialDay: string;
}) {
  const [audience, setAudience] = useState<"any" | ServiceAudience>("any");
  const visibleServices = audience === "any"
    ? services
    : services.filter((service) => service.audience === audience);
  const groups = days
    .map((day) => ({ day, services: visibleServices.filter((service) => service.day === day) }))
    .filter((group) => group.services.length > 0);
  const [openDay, setOpenDay] = useState<string | null>(
    groups.some((group) => group.day === initialDay) ? initialDay : groups[0]?.day ?? null
  );

  return (
    <>
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filtrar actividades por audiencia">
        {audienceFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => {
              setAudience(filter.value);
              const firstDay = days.find((day) => visibleServices.some((service) => service.day === day && (filter.value === "any" || service.audience === filter.value)));
              setOpenDay(firstDay ?? null);
            }}
            aria-pressed={audience === filter.value}
            className={`shrink-0 border px-3 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              audience === filter.value
                ? "border-ink bg-ink text-white"
                : "border-ink/15 text-ink/65 hover:border-ink/45 hover:text-ink"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="divide-y divide-line border-y border-line lg:hidden">
        {groups.map((group) => {
          const isOpen = group.day === openDay;
          return (
            <div key={group.day} className={`group transition-colors ${isOpen ? "bg-mist/55" : ""}`}>
              <button
                type="button"
                onClick={() => setOpenDay((current) => (current === group.day ? null : group.day))}
                aria-expanded={isOpen}
                className={`flex w-full items-center justify-between px-1 py-5 text-left font-display text-2xl font-semibold transition ${
                  isOpen ? "text-ink" : "text-ink/70 hover:text-ink"
                }`}
              >
                {group.day}
                <span className={`grid h-7 w-7 place-items-center border border-line text-lg font-normal text-muted transition duration-300 ${isOpen ? "rotate-45 border-ink/30 text-ink" : ""}`} aria-hidden="true">
                  +
                </span>
              </button>
              <div className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                <div className="overflow-hidden">
                  <div className="divide-y divide-line border-t border-line">
                    {group.services.map((service) => <ScheduleRow key={`${service.label}-${service.time}`} service={service} />)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden divide-y divide-line border-y border-line lg:block" data-stagger>
        {groups.map((group) => (
          <div key={group.day} className="grid grid-cols-[180px_1fr]">
            <div className="bg-surface px-6 py-6 font-display text-2xl font-semibold text-ink">
              {group.day}
            </div>
            <div className="divide-y divide-line">
              {group.services.map((service) => <ScheduleRow key={`${service.label}-${service.time}`} service={service} />)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function ScheduleRow({ service }: { service: GeneralService }) {
  const isGdi = service.location === "homes";

  return (
    <div className="flex flex-col gap-3 px-1 py-5 transition-colors hover:bg-mist/65 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-start gap-4">
        <time className="min-w-[76px] font-display text-xl font-bold text-ink">{service.time}</time>
        <div>
          <p className="font-semibold text-carbon">{service.label}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-muted">
            <span>{getServiceLocation(service)}</span>
            {service.audience !== "all" && <span>Para {audienceLabel(service.audience)}</span>}
            {service.streamed && (
              <BadgeLink href="/en-vivo" variant="video">
                <BadgeDot tone="brand" />
                YouTube
              </BadgeLink>
            )}
            {isGdi && (
              <InteractiveLink href="/ministerios/gdi" className="text-brand-dark">
                Consultar por un GDI
              </InteractiveLink>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function audienceLabel(audience: Exclude<ServiceAudience, "all">) {
  return {
    children: "niños",
    teens: "adolescentes",
    youth: "jóvenes",
    formation: "formación",
    service: "servicio",
  }[audience];
}
