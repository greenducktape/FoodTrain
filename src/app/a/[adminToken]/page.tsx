import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addDay,
  adminDeleteSignup,
  deleteDay,
  updateDay,
  updatePlanDetails,
} from "@/app/actions";
import { CopyButton } from "@/components/CopyButton";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { formatDateLong, todayIso } from "@/lib/dates";
import { loadDaysWithSignups } from "@/lib/queries";

export const dynamic = "force-dynamic";

const inputClass =
  "mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ adminToken: string }>;
}) {
  const { adminToken } = await params;

  const [plan] = await db
    .select()
    .from(plans)
    .where(eq(plans.adminToken, adminToken));
  if (!plan) notFound();

  const days = await loadDaysWithSignups(plan);
  const today = todayIso();

  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const publicUrl = `${proto}://${host}/p/${plan.publicToken}`;
  const adminUrl = `${proto}://${host}/a/${plan.adminToken}`;

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <p className="text-sm font-medium text-amber-700">
        🔑 Verwaltung – nur für dich
      </p>
      <h1 className="mt-1 text-2xl font-bold text-stone-900">{plan.title}</h1>

      {/* Links */}
      <section className="mt-6 space-y-3 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
        <h2 className="font-semibold text-stone-900">Links</h2>
        <div>
          <p className="text-sm font-medium text-stone-700">
            📣 Öffentlicher Link – an alle Helferinnen und Helfer schicken:
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <Link
              href={`/p/${plan.publicToken}`}
              className="min-w-0 flex-1 truncate rounded-lg bg-stone-100 px-3 py-2 text-sm text-amber-700 underline"
            >
              {publicUrl}
            </Link>
            <CopyButton text={publicUrl} />
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-stone-700">
            🔒 Verwaltungs-Link – privat aufbewahren (z.B. als Lesezeichen):
          </p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="min-w-0 flex-1 truncate rounded-lg bg-stone-100 px-3 py-2 text-sm text-stone-500">
              {adminUrl}
            </span>
            <CopyButton text={adminUrl} />
          </div>
        </div>
      </section>

      {/* Details */}
      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
        <h2 className="font-semibold text-stone-900">Eure Angaben</h2>
        <p className="mt-1 text-sm text-stone-500">
          Diese Infos sehen alle mit dem öffentlichen Link.
        </p>
        <form action={updatePlanDetails.bind(null, adminToken)} className="mt-4 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-stone-700">
              Titel
            </label>
            <input id="title" name="title" required maxLength={200} defaultValue={plan.title} className={inputClass} />
          </div>
          <div>
            <label htmlFor="recipientName" className="block text-sm font-medium text-stone-700">
              Wer bekommt das Essen?
            </label>
            <input
              id="recipientName"
              name="recipientName"
              required
              maxLength={200}
              defaultValue={plan.recipientName}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="allergies" className="block text-sm font-medium text-stone-700">
              Allergien &amp; Unverträglichkeiten
            </label>
            <textarea
              id="allergies"
              name="allergies"
              rows={3}
              maxLength={2000}
              defaultValue={plan.allergies}
              placeholder="z.B. keine Nüsse, laktosefrei, vegetarisch bevorzugt …"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="generalNotes" className="block text-sm font-medium text-stone-700">
              Allgemeine Hinweise
            </label>
            <textarea
              id="generalNotes"
              name="generalNotes"
              rows={3}
              maxLength={2000}
              defaultValue={plan.generalNotes}
              placeholder="z.B. Adresse, Klingel funktioniert nicht – bitte anrufen, Boxen bitte beschriften …"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Speichern
          </button>
        </form>
      </section>

      {/* Tag hinzufügen */}
      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
        <h2 className="font-semibold text-stone-900">Wunschtag hinzufügen</h2>
        <p className="mt-1 text-sm text-stone-500">
          An diesen Tagen wünscht ihr euch Essen. Helfer können sich dann dafür
          eintragen.
        </p>
        <form action={addDay.bind(null, adminToken)} className="mt-4 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-stone-700">
                Datum
              </label>
              <input id="date" name="date" type="date" required min={today} className={inputClass} />
            </div>
            <div>
              <label htmlFor="timeWindow" className="block text-sm font-medium text-stone-700">
                Beste Uhrzeit
              </label>
              <input
                id="timeWindow"
                name="timeWindow"
                maxLength={100}
                placeholder="z.B. 17–19 Uhr"
                className={inputClass}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              name="visitWelcome"
              className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
            />
            Besuch ist an diesem Tag willkommen (sonst: Essen bitte vor die Tür
            stellen)
          </label>
          <div>
            <label htmlFor="note" className="block text-sm font-medium text-stone-700">
              Notiz zum Tag (optional)
            </label>
            <input
              id="note"
              name="note"
              maxLength={500}
              placeholder="z.B. an dem Tag sind wir erst ab 16 Uhr zu Hause"
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Tag hinzufügen
          </button>
        </form>
      </section>

      {/* Tage & Einträge */}
      <section className="mt-6">
        <h2 className="font-semibold text-stone-900">
          Eure Wunschtage ({days.length})
        </h2>
        {days.length === 0 && (
          <p className="mt-2 text-sm text-stone-500">
            Noch keine Tage eingetragen. Füge oben euren ersten Wunschtag hinzu.
          </p>
        )}
        <div className="mt-3 space-y-3">
          {days.map((day) => (
            <details
              key={day.id}
              className="group rounded-2xl bg-white shadow-sm ring-1 ring-stone-200"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className={`font-medium ${day.date < today ? "text-stone-400" : "text-stone-900"}`}>
                    {formatDateLong(day.date)}
                    {day.date < today && " · vorbei"}
                  </p>
                  <p className="mt-0.5 text-sm text-stone-500">
                    {day.timeWindow && `🕐 ${day.timeWindow} · `}
                    {day.visitWelcome ? "🏠 Besuch willkommen" : "🚪 Vor die Tür stellen"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    day.signups.length > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {day.signups.length > 0
                    ? `✓ ${day.signups.length} Eintrag${day.signups.length > 1 ? "e" : ""}`
                    : "Noch frei"}
                </span>
              </summary>

              <div className="space-y-4 border-t border-stone-100 p-4">
                {day.signups.length > 0 && (
                  <ul className="space-y-2">
                    {day.signups.map((signup) => (
                      <li
                        key={signup.id}
                        className="flex items-start justify-between gap-3 rounded-lg bg-stone-50 p-3"
                      >
                        <div className="min-w-0 text-sm">
                          <p className="font-medium text-stone-900">
                            {signup.helperName} bringt: {signup.dish}
                          </p>
                          {signup.note && (
                            <p className="mt-0.5 text-stone-500">{signup.note}</p>
                          )}
                        </div>
                        <form action={adminDeleteSignup.bind(null, adminToken, signup.id)}>
                          <button
                            type="submit"
                            className="text-xs text-red-600 hover:underline"
                          >
                            Entfernen
                          </button>
                        </form>
                      </li>
                    ))}
                  </ul>
                )}

                <form action={updateDay.bind(null, adminToken, day.id)} className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-stone-700">
                        Beste Uhrzeit
                      </label>
                      <input
                        name="timeWindow"
                        maxLength={100}
                        defaultValue={day.timeWindow}
                        placeholder="z.B. 17–19 Uhr"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700">
                        Notiz zum Tag
                      </label>
                      <input name="note" maxLength={500} defaultValue={day.note} className={inputClass} />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-stone-700">
                    <input
                      type="checkbox"
                      name="visitWelcome"
                      defaultChecked={day.visitWelcome}
                      className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                    />
                    Besuch ist willkommen
                  </label>
                  <button
                    type="submit"
                    className="rounded-lg bg-stone-700 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-stone-800"
                  >
                    Tag speichern
                  </button>
                </form>

                <form action={deleteDay.bind(null, adminToken, day.id)}>
                  <button
                    type="submit"
                    className="text-sm text-red-600 hover:underline"
                  >
                    Diesen Tag löschen
                  </button>
                </form>
              </div>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
