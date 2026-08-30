import type { GeneralService, SpecialService } from "./data";

const BUENOS_AIRES_TIME_ZONE = "America/Argentina/Buenos_Aires";
const WEEKDAY_INDEX: Record<string, number> = {
  Domingo: 0,
  Lunes: 1,
  Martes: 2,
  Miércoles: 3,
  Jueves: 4,
  Viernes: 5,
  Sábados: 6,
};

type BuenosAiresDate = {
  year: number;
  month: number;
  day: number;
};

export type SpecialOccurrence = {
  date: BuenosAiresDate;
  isOverride: boolean;
};

export function getServiceLocation(service: GeneralService | SpecialService) {
  if (service.locationLabel) return service.locationLabel;
  return service.location === "homes" ? "En hogares" : "Auditorio";
}

export function getNextGeneralService(services: GeneralService[], now = new Date()) {
  const current = getBuenosAiresDate(now);
  const currentTime = now.getTime();
  const sorted = services
    .map((service) => ({ service, time: parseTime(service.time) }))
    .filter((entry): entry is { service: GeneralService; time: { hour: number; minute: number } } => Boolean(entry.time))
    .sort((left, right) => left.time.hour * 60 + left.time.minute - right.time.hour * 60 - right.time.minute);

  for (let offset = 0; offset < 8; offset += 1) {
    const candidateDate = addDays(current, offset);
    const weekday = new Date(Date.UTC(candidateDate.year, candidateDate.month - 1, candidateDate.day)).getUTCDay();

    for (const entry of sorted) {
      if (WEEKDAY_INDEX[entry.service.day] !== weekday) continue;
      const startsAt = Date.UTC(candidateDate.year, candidateDate.month - 1, candidateDate.day, entry.time.hour + 3, entry.time.minute);
      if (startsAt > currentTime) {
        return { service: entry.service, date: candidateDate };
      }
    }
  }

  return undefined;
}

export function getNextSpecialOccurrence(service: SpecialService, now = new Date()) {
  const current = getBuenosAiresDate(now);
  const override = parseDate(service.nextDate);

  if (override && toDateKey(override) >= toDateKey(current)) {
    return { date: override, isOverride: true } satisfies SpecialOccurrence;
  }

  for (let offset = 0; offset < 14; offset += 1) {
    const month = current.month + offset;
    const year = current.year + Math.floor((month - 1) / 12);
    const normalizedMonth = ((month - 1) % 12) + 1;
    const day = service.recurrence === "first-sunday"
      ? firstSundayOfMonth(year, normalizedMonth)
      : 1;
    const candidate = { year, month: normalizedMonth, day };

    if (toDateKey(candidate) >= toDateKey(current)) {
      return { date: candidate, isOverride: false } satisfies SpecialOccurrence;
    }
  }

  return undefined;
}

export function formatScheduleDate(date: BuenosAiresDate, time?: string) {
  const value = new Date(Date.UTC(date.year, date.month - 1, date.day, 15));
  const day = new Intl.DateTimeFormat("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(value);

  return `${day.charAt(0).toUpperCase()}${day.slice(1)}${time ? ` · ${time}` : ""}`;
}

export function calendarUrl({
  title,
  date,
  time,
  location,
  durationMinutes,
}: {
  title: string;
  date: BuenosAiresDate;
  time?: string;
  location: string;
  durationMinutes?: number;
}) {
  const params = new URLSearchParams({
    title,
    date: `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`,
    location,
  });

  if (time) params.set("time", time);
  if (durationMinutes) params.set("duration", String(durationMinutes));
  return `/api/calendario?${params.toString()}`;
}

function getBuenosAiresDate(now: Date): BuenosAiresDate {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: BUENOS_AIRES_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);

  return { year: value("year"), month: value("month"), day: value("day") };
}

function parseTime(value: string) {
  const match = value.match(/(\d{1,2}):(\d{2})/);
  if (!match) return undefined;
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

function parseDate(value?: string): BuenosAiresDate | undefined {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day));

  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    return undefined;
  }

  return { year, month, day };
}

function addDays(date: BuenosAiresDate, days: number): BuenosAiresDate {
  const result = new Date(Date.UTC(date.year, date.month - 1, date.day + days));
  return { year: result.getUTCFullYear(), month: result.getUTCMonth() + 1, day: result.getUTCDate() };
}

function firstSundayOfMonth(year: number, month: number) {
  const weekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  return 1 + ((7 - weekday) % 7);
}

function toDateKey(date: BuenosAiresDate) {
  return date.year * 10_000 + date.month * 100 + date.day;
}
