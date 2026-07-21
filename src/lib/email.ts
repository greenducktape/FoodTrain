import type { Plan, PlanDay } from "@/db/schema";
import { formatDateLong } from "./dates";

function appUrl(): string {
  return process.env.APP_URL ?? "https://kochkette.com";
}

/**
 * Versendet eine Mail über Resend. Läuft nur, wenn RESEND_API_KEY
 * gesetzt ist. Fehler beim Versand dürfen die App nie blockieren.
 */
async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !to) return;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "Kochkette <post@kochkette.com>",
        to: [to],
        subject,
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

/**
 * Schickt den Empfängern nach dem Einrichten ihres Plans den
 * Verwaltungs-Link (und den Link zum Teilen) per Mail, damit
 * beide Links nicht verloren gehen.
 */
export async function sendWelcomeEmail(plan: Plan, to: string): Promise<void> {
  const adminUrl = `${appUrl()}/a/${plan.adminToken}`;
  const publicUrl = `${appUrl()}/p/${plan.publicToken}`;

  const text = [
    `Hallo!`,
    ``,
    `Euer Plan „${plan.title}“ ist eingerichtet. Damit die Links`,
    `nicht verloren gehen, kommen sie hier noch einmal per Mail:`,
    ``,
    `🔑 Euer Verwaltungs-Link (bitte nicht weitergeben):`,
    adminUrl,
    ``,
    `📤 Link zum Teilen mit Helferinnen und Helfern:`,
    publicUrl,
    ``,
    `Über den Verwaltungs-Link könnt ihr jederzeit Tage, Hinweise`,
    `und Benachrichtigungen anpassen – oder den Plan löschen.`,
    ``,
    `Von Herzen gekocht,`,
    `eure Kochkette 💛`,
  ].join("\n");

  await sendEmail(to, `💛 Eure Links für „${plan.title}“`, text);
}

/**
 * Benachrichtigt die Empfänger per Mail, wenn sich jemand einträgt.
 * Läuft nur, wenn eine E-Mail hinterlegt ist und
 * Benachrichtigungen nicht abgeschaltet sind.
 */
export async function sendSignupNotification(
  plan: Plan,
  day: PlanDay,
  helperName: string,
  dish: string
): Promise<void> {
  if (!plan.notifyEmail || !plan.notifyEnabled) return;

  const adminUrl = `${appUrl()}/a/${plan.adminToken}`;
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

  await sendEmail(
    plan.notifyEmail,
    `💛 ${helperName} bringt euch am ${date} Essen vorbei`,
    text
  );
}
