"use client";

import { useEffect, useState } from "react";
import {
  getBuenosAiresRadioDay,
  getCurrentRadioProgram,
  getScheduleForRadioDay,
  radioScheduleDays,
  type RadioScheduleDay,
  type RadioScheduleItem,
} from "@/lib/radio-schedule";

const LIVE_REFRESH_MS = 60_000;

export default function RadioScheduleTabs({
  schedule,
  initialDay,
  currentProgram,
}: {
  schedule: RadioScheduleItem[];
  initialDay: RadioScheduleDay;
  currentProgram: RadioScheduleItem | null;
}) {
  const [selectedDay, setSelectedDay] = useState<RadioScheduleDay>(initialDay);
  const items = getScheduleForRadioDay(schedule, selectedDay);

  // Recalcula "Ahora" en el cliente para que no quede desactualizado si la
  // página queda abierta más allá del horario con el que se generó el server-render.
  const [liveNow, setLiveNow] = useState<Date | null>(null);
  useEffect(() => {
    const update = () => setLiveNow(new Date());
    update();
    const id = window.setInterval(update, LIVE_REFRESH_MS);
    return () => window.clearInterval(id);
  }, []);

  const liveDay = liveNow ? getBuenosAiresRadioDay(liveNow) : initialDay;
  const liveProgram = liveNow ? getCurrentRadioProgram(schedule, liveNow) : currentProgram;

  return (
    <>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Elegir día de programación">
        {radioScheduleDays.map((day) => (
          <button
            key={day}
            type="button"
            role="tab"
            aria-selected={selectedDay === day}
            onClick={() => setSelectedDay(day)}
            className={`shrink-0 border px-3 py-2 text-xs font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${
              selectedDay === day
                ? "border-ink bg-ink text-white"
                : "border-ink/15 text-ink/65 hover:border-ink/45 hover:text-ink"
            }`}
          >
            {day.slice(0, 3)}
          </button>
        ))}
      </div>

      <div className="overflow-hidden border-y border-ink/10" data-stagger>
        {items.length > 0 ? (
          items.map((item) => {
            const isCurrent = selectedDay === liveDay && liveProgram?.time === item.time && liveProgram.program === item.program;
            const isAutomated = item.host.trim().toLowerCase() === "automatizado";

            return (
              <div
                key={`${item.day}-${item.time}-${item.program}`}
                className={`flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 px-5 py-5 transition-colors last:border-0 sm:px-6 ${
                  isCurrent ? "bg-mist" : "odd:bg-black/5 hover:bg-mist/70"
                }`}
              >
                <span className="min-w-[120px] font-display text-lg text-ink">{item.time}</span>
                <div className="min-w-[12rem] flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-ink/90">{item.program}</span>
                    {isCurrent && (
                      <span className="inline-flex items-center gap-1.5 border border-brand/30 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-dark">
                        <span className="h-1.5 w-1.5 animate-pulseSlow rounded-full bg-brand" />
                        Ahora
                      </span>
                    )}
                    {!isAutomated && (
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-ink/40">En vivo</span>
                    )}
                  </div>
                </div>
                <span className="text-sm text-ink/45">{item.host}</span>
              </div>
            );
          })
        ) : (
          <p className="px-5 py-6 text-sm text-copy sm:px-6">No hay programas cargados para este día.</p>
        )}
      </div>
    </>
  );
}
