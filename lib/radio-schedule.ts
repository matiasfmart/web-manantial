export type RadioScheduleItem = {
  time: string;
  program: string;
  host: string;
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

export function getCurrentRadioProgram(schedule: RadioScheduleItem[], now = new Date()) {
  const currentMinutes = getBuenosAiresMinutes(now);
  if (currentMinutes === null) return null;

  for (const item of schedule) {
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