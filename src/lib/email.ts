import type { Plan, PlanDay } from "@/db/schema";
import { formatDateLong } from "./dates";

/**
 * Benachrichtigt die Familie per Mail, wenn sich jemand einträgt.
 * Läuft nur, wenn RESEND_API_KEY gesetzt ist und die Familie eine
 * E-Mail hinterlegt und Benachrichtigungen nicht abgeschaltet hat.
 * Fehler beim Versand dürfen das Eintragen nie blockieren.
 */
export async function sendSignupNotification(
  plan: Plan,
  day: PlanDay,
  helperName: string,
  dish: string
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !plan.notifyEmail || !plan.notifyEnabled) return;

  const appUrl = process.env.APP_URL ?? "https://kochkette.com";
  const adminUrl = `${appUrl}/a/${plan.adminToken}`;
  const date = formatDateLong(day.date);

  const text = [
    `Hallo!`,
    ``,
    `Schöne Nachricht: ${helperName} hat sich gerade eingetragen`,
    `und bringt euch am ${date} etwas vorbei:`,
    ``,
    `🍲 ${dish}`,
    ``,
    day.timeWindow ? `Zeitfenster: ${day.timeWindow}` : null,
    ``,
    `Alle Einträge und Einstellungen findet ihr hier:`,
    adminUrl,
    ``,
    `Benachrichtigungen könnt ihr dort jederzeit abschalten.`,
    ``,
    `Von Herzen gekocht,`,
    `eure Kochkette 💛`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "Kochkette <post@kochkette.com>",
        to: [plan.notifyEmail],
        subject: `💛 ${helperName} bringt euch am ${date} Essen vorbei`,
        text,
      }),
    });
    if (!response.ok) {
      console.error("E-Mail-Versand fehlgeschlagen:", await response.text());
    }
  } catch (error) {
    console.error("E-Mail-Versand fehlgeschlagen:", error);
  }
}
