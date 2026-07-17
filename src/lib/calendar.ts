import type { Plan, PlanDay } from "@/db/schema";

export function addDaysIso(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function compact(isoDate: string): string {
  return isoDate.replaceAll("-", "");
}

function eventTexts(day: PlanDay, plan: Plan) {
  const title = `Essen für ${plan.recipientName} vorbeibringen 🍲`;
  const details = [
    day.timeWindow && `Beste Zeit: ${day.timeWindow}`,
    day.visitWelcome
      ? "Ein kurzer Besuch ist willkommen."
      : "Bitte das Essen vor die Tür stellen.",
    day.note,
    plan.allergies && `Bitte beachten: ${plan.allergies}`,
  ]
    .filter(Boolean)
    .join("\n");
  return { title, details };
}

export function googleCalendarUrl(day: PlanDay, plan: Plan): string {
  const { title, details } = eventTexts(day, plan);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${compact(day.date)}/${compact(addDaysIso(day.date, 1))}`,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function escapeIcs(text: string): string {
  return text
    .replaceAll("\\", "\\\\")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,")
    .replaceAll("\n", "\\n");
}

export function buildIcs(day: PlanDay, plan: Plan): string {
  const { title, details } = eventTexts(day, plan);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Essensplan//DE",
    "BEGIN:VEVENT",
    `UID:essensplan-${plan.id}-${day.id}@essensplan`,
    `DTSTAMP:${stamp}`,
    `DTSTART;VALUE=DATE:${compact(day.date)}`,
    `DTEND;VALUE=DATE:${compact(addDaysIso(day.date, 1))}`,
    `SUMMARY:${escapeIcs(title)}`,
    `DESCRIPTION:${escapeIcs(details)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
