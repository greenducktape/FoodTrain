import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { createSignup, deleteSignup, updateSignup } from "@/app/actions";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { formatDateLong, todayIso } from "@/lib/dates";
import { loadDaysWithSignups } from "@/lib/queries";

export const dynamic = "force-dynamic";

const inputClass =
  "mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500";

export default async function PublicPage({
  params,
}: {
  params: Promise<{ publicToken: string }>;
}) {
  const { publicToken } = await params;

  const [plan] = await db
    .select()
    .from(plans)
    .where(eq(plans.publicToken, publicToken));
  if (!plan) notFound();

  const days = await loadDaysWithSignups(plan);
  const today = todayIso();
  const upcoming = days.filter((d) => d.date >= today);
  const past = days.filter((d) => d.date < today);

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <div className="text-center">
        <div className="text-4xl">🍲</div>
        <h1 className="mt-2 text-2xl font-bold text-stone-900">{plan.title}</h1>
        <p className="mt-1 text-stone-600">
          Wir kochen für <span className="font-medium">{plan.recipientName}</span> –
          such dir einen Tag aus und trag dich ein. Danke, dass du mithilfst! 💛
        </p>
      </div>

      {(plan.allergies || plan.generalNotes) && (
        <section className="mt-6 space-y-3">
          {plan.allergies && (
            <div className="rounded-2xl bg-red-50 p-4 ring-1 ring-red-200">
              <p className="text-sm font-semibold text-red-800">
                ⚠️ Bitte beachten – Allergien &amp; Unverträglichkeiten:
              </p>
              <p className="mt-1 whitespace-pre-line text-sm text-red-700">
                {plan.allergies}
              </p>
            </div>
          )}
          {plan.generalNotes && (
            <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
              <p className="text-sm font-semibold text-stone-800">ℹ️ Hinweise:</p>
              <p className="mt-1 whitespace-pre-line text-sm text-stone-600">
                {plan.generalNotes}
              </p>
            </div>
          )}
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-semibold text-stone-900">Wunschtage</h2>
        {upcoming.length === 0 && (
          <p className="mt-2 text-sm text-stone-500">
            Aktuell sind keine offenen Tage eingetragen. Schau später noch einmal
            vorbei!
          </p>
        )}
        <div className="mt-3 space-y-3">
          {upcoming.map((day) => (
            <div
              key={day.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-stone-900">
                    {formatDateLong(day.date)}
                  </p>
                  <p className="mt-0.5 text-sm text-stone-500">
                    {day.timeWindow && `🕐 ${day.timeWindow} · `}
                    {day.visitWelcome
                      ? "🏠 Besuch willkommen"
                      : "🚪 Bitte vor die Tür stellen"}
                  </p>
                  {day.note && (
                    <p className="mt-1 text-sm text-stone-500">💬 {day.note}</p>
                  )}
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
                    day.signups.length > 0
                      ? "bg-green-100 text-green-800"
                      : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {day.signups.length > 0 ? "✓ Versorgt" : "Noch frei"}
                </span>
              </div>

              {day.signups.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {day.signups.map((signup) => (
                    <li key={signup.id} className="rounded-lg bg-stone-50 p-3">
                      <div className="text-sm">
                        <p className="font-medium text-stone-900">
                          {signup.helperName} bringt: {signup.dish}
                        </p>
                        {signup.note && (
                          <p className="mt-0.5 text-stone-500">{signup.note}</p>
                        )}
                      </div>
                      <details className="mt-2">
                        <summary className="cursor-pointer text-xs text-stone-400 hover:text-stone-600">
                          Eintrag ändern
                        </summary>
                        <form
                          action={updateSignup.bind(null, publicToken, signup.id)}
                          className="mt-3 space-y-3"
                        >
                          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <div>
                              <label className="block text-xs font-medium text-stone-600">
                                Name
                              </label>
                              <input
                                name="helperName"
                                required
                                maxLength={100}
                                defaultValue={signup.helperName}
                                className={inputClass}
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-medium text-stone-600">
                                Gericht
                              </label>
                              <input
                                name="dish"
                                required
                                maxLength={200}
                                defaultValue={signup.dish}
                                className={inputClass}
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-stone-600">
                              Notiz
                            </label>
                            <input
                              name="note"
                              maxLength={500}
                              defaultValue={signup.note}
                              className={inputClass}
                            />
                          </div>
                          <button
                            type="submit"
                            className="rounded-lg bg-stone-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-stone-800"
                          >
                            Speichern
                          </button>
                        </form>
                        <form
                          action={deleteSignup.bind(null, publicToken, signup.id)}
                          className="mt-2"
                        >
                          <button
                            type="submit"
                            className="text-xs text-red-600 hover:underline"
                          >
                            Eintrag löschen
                          </button>
                        </form>
                      </details>
                    </li>
                  ))}
                </ul>
              )}

              <details className="mt-3">
                <summary className="cursor-pointer rounded-lg bg-amber-600 px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-amber-700">
                  🍽️ Ich bringe etwas mit
                </summary>
                <form
                  action={createSignup.bind(null, publicToken, day.id)}
                  className="mt-4 space-y-3 rounded-lg bg-amber-50 p-4"
                >
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-stone-700">
                        Dein Name
                      </label>
                      <input
                        name="helperName"
                        required
                        maxLength={100}
                        placeholder="z.B. Familie Schmidt"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-stone-700">
                        Was bringst du mit?
                      </label>
                      <input
                        name="dish"
                        required
                        maxLength={200}
                        placeholder="z.B. Lasagne + Salat"
                        className={inputClass}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700">
                      Notiz (optional)
                    </label>
                    <input
                      name="note"
                      maxLength={500}
                      placeholder="z.B. komme gegen 18 Uhr"
                      className={inputClass}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
                  >
                    Eintragen
                  </button>
                </form>
              </details>
            </div>
          ))}
        </div>
      </section>

      {past.length > 0 && (
        <details className="mt-8">
          <summary className="cursor-pointer text-sm font-medium text-stone-500">
            Vergangene Tage anzeigen ({past.length})
          </summary>
          <ul className="mt-3 space-y-2">
            {past.map((day) => (
              <li
                key={day.id}
                className="rounded-xl bg-white/60 p-3 text-sm text-stone-400 ring-1 ring-stone-200"
              >
                <p>{formatDateLong(day.date)}</p>
                {day.signups.map((signup) => (
                  <p key={signup.id} className="mt-0.5">
                    {signup.helperName}: {signup.dish}
                  </p>
                ))}
              </li>
            ))}
          </ul>
        </details>
      )}

      <p className="mt-10 text-center text-xs text-stone-400">
        Mit 💛 organisiert über Essensplan
      </p>
    </main>
  );
}
