import { NextResponse } from "next/server";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = clean(searchParams.get("title"), "Reunión - Manantial de Avivamiento");
  const location = clean(searchParams.get("location"), "Auditorio Manantial de Avivamiento");
  const date = searchParams.get("date");
  const time = searchParams.get("time");
  const duration = Number(searchParams.get("duration")) || 120;

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Fecha de reunión inválida." }, { status: 400 });
  }

  const ics = createCalendarEvent({ title, location, date, time, duration });
  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="reunion-manantial.ics"',
      "Cache-Control": "no-store",
    },
  });
}

function createCalendarEvent({
  title,
  location,
  date,
  time,
  duration,
}: {
  title: string;
  location: string;
  date: string;
  time: string | null;
  duration: number;
}) {
  const dateValue = date.replaceAll("-", "");
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Manantial de Avivamiento//Reuniones//ES",
    "BEGIN:VEVENT",
    `UID:${dateValue}-${slug(title)}@manantialdeavivamiento.com`,
    `DTSTAMP:${toIcsDate(new Date())}`,
    `SUMMARY:${escapeIcs(title)}`,
    `LOCATION:${escapeIcs(location)}`,
    "DESCRIPTION:Reunión de Ministerio Manantial de Avivamiento.",
  ];

  if (time && /^\d{1,2}:\d{2}/.test(time)) {
    const [hours, minutes] = time.match(/\d{1,2}:\d{2}/)?.[0].split(":") ?? [];
    const start = new Date(`${date}T${hours.padStart(2, "0")}:${minutes}:00-03:00`);
    const end = new Date(start.getTime() + duration * 60_000);
    lines.push(`DTSTART:${toIcsDate(start)}`, `DTEND:${toIcsDate(end)}`);
  } else {
    const endDate = new Date(`${date}T12:00:00Z`);
    endDate.setUTCDate(endDate.getUTCDate() + 1);
    lines.push(`DTSTART;VALUE=DATE:${dateValue}`, `DTEND;VALUE=DATE:${toIcsDate(endDate).slice(0, 8)}`);
  }

  lines.push("END:VEVENT", "END:VCALENDAR", "");
  return lines.join("\r\n");
}

function clean(value: string | null, fallback: string) {
  return (value || fallback).replace(/[\r\n]/g, " ").trim().slice(0, 160);
}

function escapeIcs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toIcsDate(value: Date) {
  return value.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}
