import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addDay,
  adminDeleteSignup,
  deleteDay,
  deletePlan,
  updateDay,
  updateNotifications,
  updatePlanDetails,
} from "@/app/actions";
import { AdminWizard } from "@/components/AdminWizard";
import { CopyButton } from "@/components/CopyButton";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { formatDateLong, todayIso } from "@/lib/dates";
import { loadDaysWithSignups } from "@/lib/queries";

export const dynamic = "force-dynamic";

const inputClass =
  "mt-1 w-full rounded-xl border-2 border-rose-100 bg-white px-4 py-2.5 text-stone-800 placeholder:text-stone-300 focus:border-rose-300 focus:outline-none";

const saveButton =
  "rounded-full bg-rose-400 px-6 py-2.5 font-semibold text-white shadow-sm shadow-rose-200 transition hover:bg-rose-500";

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

  const isFresh = days.length === 0 && !plan.allergies && !plan.generalNotes;
  if (isFresh) {
    return <AdminWizard adminToken={adminToken} recipientName={plan.recipientName} />;
  }

  const headerList = await headers();
  const host = headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const publicUrl = `${proto}://${host}/p/${plan.publicToken}`;
  const adminUrl = `${proto}://${host}/a/${plan.adminToken}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Hallo ihr Lieben! 💛 Wir organisieren Essen für ${plan.recipientName}. Hier könnt ihr euch einen Tag aussuchen und eintragen: ${publicUrl}`
  )}`;

  return (
    <main className="mx-auto max-w-xl px-5 py-12">
      <p className="text-center text-sm font-medium tracking-wide text-rose-400">
        🔑 Euer privater Verwaltungsbereich
      </p>
      <h1 className="mt-2 text-center text-3xl font-bold text-stone-800">
        {plan.title}
      </h1>

      {/* Link teilen */}
      <section className="mt-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-rose-100">
        <h2 className="text-lg font-bold text-stone-800">💌 Ladet eure Helfer ein</h2>
        <p className="mt-1 text-stone-500">
          Schickt diesen Link an alle, die etwas kochen möchten:
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Link
            href={`/p/${plan.publicToken}`}
            className="min-w-0 flex-1 truncate rounded-xl bg-rose-50 px-4 py-2.5 text-sm text-rose-500 underline"
          >
            {publicUrl}
          </Link>
          <CopyButton text={publicUrl} />
        </div>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block rounded-full bg-emerald-500 px-6 py-3 text-center font-semibold text-white shadow-sm transition hover:bg-emerald-600"
        >
          Per WhatsApp teilen
        </a>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-stone-400 hover:text-stone-600">
            🔒 Euer privater Verwaltungs-Link (bitte gut aufbewahren)
          </summary>
          <div className="mt-2 flex items-center gap-2">
            <span className="min-w-0 flex-1 truncate rounded-xl bg-stone-50 px-4 py-2.5 text-sm text-stone-400">
              {adminUrl}
            </span>
            <CopyButton text={adminUrl} />
          </div>
          <p className="mt-2 text-xs text-stone-400">
            Nur mit diesem Link könnt ihr den Plan verwalten – am besten als
            Lesezeichen speichern.
          </p>
        </details>
      </section>

      {/* Tage */}
      <section className="mt-8">
        <h2 className="text-lg font-bold text-stone-800">
          🗓️ Eure Wunschtage
        </h2>
        <div className="mt-3 space-y-3">
          {days.map((day) => (
            <details
              key={day.id}
              className="group rounded-3xl bg-white shadow-sm ring-1 ring-rose-100"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-3 p-5">
                <div className="min-w-0">
                  <p
                    className={`font-semibold ${
                      day.date < today ? "text-stone-400" : "text-stone-800"
                    }`}
                  >
                    {formatDateLong(day.date)}
                  </p>
                  <p className="mt-0.5 text-sm text-stone-500">
                    {day.timeWindow && `🕐 ${day.timeWindow} · `}
                    {day.visitWelcome ? "🤗 Besuch willkommen" : "🚪 Vor die Tür"}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                    day.signups.length > 0
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-rose-50 text-rose-500"
                  }`}
                >
                  {day.signups.length > 0
                    ? `💛 ${day.signups.length > 1 ? `${day.signups.length}× versorgt` : "versorgt"}`
                    : "noch frei"}
                </span>
              </summary>

              <div className="space-y-4 border-t border-rose-50 p-5">
                {day.signups.length > 0 && (
                  <ul className="space-y-2">
                    {day.signups.map((signup) => (
                      <li
                        key={signup.id}
                        className="flex items-start justify-between gap-3 rounded-2xl bg-[#FDF7F2] p-4"
                      >
                        <div className="min-w-0 text-sm">
                          <p className="font-semibold text-stone-700">
                            {signup.helperName} bringt {signup.dish}
                          </p>
                          {signup.note && (
                            <p className="mt-0.5 text-stone-500">{signup.note}</p>
                          )}
                        </div>
                        <form action={adminDeleteSignup.bind(null, adminToken, signup.id)}>
                          <button
                            type="submit"
                            className="text-xs text-stone-400 hover:text-rose-500"
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
                      <label className="block text-sm font-semibold text-stone-600">
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
                      <label className="block text-sm font-semibold text-stone-600">
                        Notiz zum Tag
                      </label>
                      <input
                        name="note"
                        maxLength={500}
                        defaultValue={day.note}
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-stone-600">
                    <input
                      type="checkbox"
                      name="visitWelcome"
                      defaultChecked={day.visitWelcome}
                      className="h-4 w-4 rounded border-rose-200 text-rose-400 focus:ring-rose-300"
                    />
                    Besuch ist an diesem Tag willkommen
                  </label>
                  <div className="flex items-center justify-between">
                    <button type="submit" className={saveButton}>
                      Speichern
                    </button>
                  </div>
                </form>
                <form action={deleteDay.bind(null, adminToken, day.id)}>
                  <button
                    type="submit"
                    className="text-sm text-stone-400 hover:text-rose-500"
                  >
                    Diesen Tag löschen
                  </button>
                </form>
              </div>
            </details>
          ))}
        </div>

        {/* Tag hinzufügen */}
        <details className="mt-4 rounded-3xl bg-white shadow-sm ring-1 ring-rose-100">
          <summary className="cursor-pointer p-5 font-semibold text-rose-500">
            ＋ Weiteren Wunschtag hinzufügen
          </summary>
          <form action={addDay.bind(null, adminToken)} className="space-y-4 border-t border-rose-50 p-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="date" className="block text-sm font-semibold text-stone-600">
                  Datum
                </label>
                <input id="date" name="date" type="date" required min={today} className={inputClass} />
              </div>
              <div>
                <label htmlFor="timeWindow" className="block text-sm font-semibold text-stone-600">
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
            <label className="flex items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                name="visitWelcome"
                className="h-4 w-4 rounded border-rose-200 text-rose-400 focus:ring-rose-300"
              />
              Besuch ist an diesem Tag willkommen
            </label>
            <div>
              <label htmlFor="note" className="block text-sm font-semibold text-stone-600">
                Notiz zum Tag (optional)
              </label>
              <input id="note" name="note" maxLength={500} className={inputClass} />
            </div>
            <button type="submit" className={saveButton}>
              Tag hinzufügen
            </button>
          </form>
        </details>
      </section>

      {/* Angaben */}
      <section className="mt-8">
        <details className="rounded-3xl bg-white shadow-sm ring-1 ring-rose-100">
          <summary className="cursor-pointer p-5 font-semibold text-stone-700">
            ✏️ Eure Angaben bearbeiten
            <span className="mt-1 block text-sm font-normal text-stone-400">
              Titel, Allergien und Hinweise für eure Helfer
            </span>
          </summary>
          <form
            action={updatePlanDetails.bind(null, adminToken)}
            className="space-y-4 border-t border-rose-50 p-5"
          >
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-stone-600">
                Titel
              </label>
              <input id="title" name="title" required maxLength={200} defaultValue={plan.title} className={inputClass} />
            </div>
            <div>
              <label htmlFor="recipientName" className="block text-sm font-semibold text-stone-600">
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
              <label htmlFor="allergies" className="block text-sm font-semibold text-stone-600">
                Allergien &amp; Unverträglichkeiten
              </label>
              <textarea
                id="allergies"
                name="allergies"
                rows={3}
                maxLength={2000}
                defaultValue={plan.allergies}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="generalNotes" className="block text-sm font-semibold text-stone-600">
                Hinweise für eure Helfer
              </label>
              <textarea
                id="generalNotes"
                name="generalNotes"
                rows={3}
                maxLength={2000}
                defaultValue={plan.generalNotes}
                className={inputClass}
              />
            </div>
            <p className="text-xs text-stone-400">
              Allergien und Hinweise sieht jeder mit dem öffentlichen Link –
              bitte nur eintragen, was eure Helfer wirklich wissen müssen.
            </p>
            <button type="submit" className={saveButton}>
              Speichern
            </button>
          </form>
        </details>
      </section>

      {/* Benachrichtigungen */}
      <section className="mt-8">
        <details className="rounded-3xl bg-white shadow-sm ring-1 ring-rose-100">
          <summary className="cursor-pointer p-5 font-semibold text-stone-700">
            🔔 Benachrichtigungen
            <span className="mt-1 block text-sm font-normal text-stone-400">
              {plan.notifyEmail && plan.notifyEnabled
                ? `Aktiv – Mail an ${plan.notifyEmail} bei jedem neuen Eintrag`
                : "Aus – ihr bekommt keine Mails"}
            </span>
          </summary>
          <form
            action={updateNotifications.bind(null, adminToken)}
            className="space-y-4 border-t border-rose-50 p-5"
          >
            <div>
              <label htmlFor="notifyEmail" className="block text-sm font-semibold text-stone-600">
                Eure E-Mail-Adresse
              </label>
              <input
                id="notifyEmail"
                name="notifyEmail"
                type="email"
                maxLength={200}
                defaultValue={plan.notifyEmail}
                placeholder="eure@email.de"
                className={inputClass}
              />
            </div>
            <label className="flex items-center gap-2 text-sm text-stone-600">
              <input
                type="checkbox"
                name="notifyEnabled"
                defaultChecked={plan.notifyEnabled}
                className="h-4 w-4 rounded border-rose-200 text-rose-400 focus:ring-rose-300"
              />
              Mail schicken, wenn sich jemand einträgt
            </label>
            <p className="text-xs text-stone-400">
              Die Adresse wird nur dafür genutzt und beim Löschen des Plans mit
              entfernt. Feld leeren + Speichern schaltet alles ab.
            </p>
            <button type="submit" className={saveButton}>
              Speichern
            </button>
          </form>
        </details>
      </section>

      {/* Plan löschen */}
      <section className="mt-8">
        <details className="rounded-3xl bg-white shadow-sm ring-1 ring-rose-100">
          <summary className="cursor-pointer p-5 text-sm font-semibold text-stone-400 hover:text-stone-600">
            Plan endgültig löschen
          </summary>
          <div className="border-t border-rose-50 p-5">
            <p className="text-sm text-stone-500">
              Löscht diesen Plan mit allen Wunschtagen, Einträgen und eurer
              E-Mail-Adresse – endgültig und ohne Wiederherstellung. Beide Links
              funktionieren danach nicht mehr.
            </p>
            <form action={deletePlan.bind(null, adminToken)} className="mt-4">
              <button
                type="submit"
                className="rounded-full bg-red-50 px-6 py-2.5 font-semibold text-red-600 ring-1 ring-red-200 transition hover:bg-red-100"
              >
                Ja, alles löschen
              </button>
            </form>
          </div>
        </details>
      </section>

      <p className="mt-12 text-center text-sm text-stone-400">
        Alles Liebe für die erste Zeit 💛
      </p>
      <p className="mt-3 text-center text-xs text-stone-300">
        <Link href="/datenschutz" className="hover:text-stone-500">
          Datenschutz
        </Link>
        {" · "}
        <Link href="/impressum" className="hover:text-stone-500">
          Impressum
        </Link>
      </p>
    </main>
  );
}
