export type RadioScheduleItem = {
  day: RadioScheduleDay;
  time: string;
  program: string;
  host: string;
};

export const radioScheduleDays = [
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábados",
  "Domingos",
] as const;

export type RadioScheduleDay = (typeof radioScheduleDays)[number] | "Todos";

const weekdayByIndex: Record<number, (typeof radioScheduleDays)[number]> = {
  0: "Domingos",
  1: "Lunes",
  2: "Martes",
  3: "Miércoles",
  4: "Jueves",
  5: "Viernes",
  6: "Sábados",
};

function timeToMinutes(value: string) {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;

  return hours * 60 + minutes;
}

function getBuenosAiresMinutes(now: Date) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "America/Argentina/Buenos_Aires",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const hour = Number(parts.find((part) => part.type === "hour")?.value);
  const minute = Number(parts.find((part) => part.type === "minute")?.value);

  return Number.isFinite(hour) && Number.isFinite(minute) ? hour * 60 + minute : null;
}

export function getBuenosAiresRadioDay(now = new Date()) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Argentina/Buenos_Aires",
    weekday: "short",
  }).format(now);
  const weekdayIndex = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);

  return weekdayByIndex[weekdayIndex] ?? "Domingos";
}

export function getScheduleForRadioDay(schedule: RadioScheduleItem[], day: RadioScheduleDay) {
  const byTime = new Map<string, RadioScheduleItem>();
  schedule
    .filter((item) => item.day === "Todos")
    .forEach((item) => byTime.set(item.time, item));
  schedule
    .filter((item) => item.day === day)
    .forEach((item) => byTime.set(item.time, item));

  return [...byTime.values()]
    .sort((left, right) => getStartMinutes(left.time) - getStartMinutes(right.time));
}

export function getCurrentRadioProgram(schedule: RadioScheduleItem[], now = new Date()) {
  const currentMinutes = getBuenosAiresMinutes(now);
  if (currentMinutes === null) return null;
  const day = getBuenosAiresRadioDay(now);

  for (const item of [...schedule.filter((item) => item.day === day), ...schedule.filter((item) => item.day === "Todos")]) {
    const [startValue, endValue] = item.time.split(/[–-]/);
    if (!startValue || !endValue || !item.program?.trim()) continue;

    const start = timeToMinutes(startValue);
    const end = timeToMinutes(endValue);
    if (start === null || end === null || start === end) continue;

    const isCurrent = start < end
      ? currentMinutes >= start && currentMinutes < end
      : currentMinutes >= start || currentMinutes < end;
    if (isCurrent) return item;
  }

  return null;
}

function getStartMinutes(time: string) {
  const start = time.split(/[–-]/)[0];
  return start ? timeToMinutes(start) ?? Number.MAX_SAFE_INTEGER : Number.MAX_SAFE_INTEGER;
}