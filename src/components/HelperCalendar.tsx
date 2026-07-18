"use client";

import { useMemo, useState } from "react";
import { createSignup, deleteSignup, updateSignup } from "@/app/actions";
import { MonthCalendar, type DayMarker } from "@/components/MonthCalendar";

export type HelperDay = {
  id: number;
  date: string;
  timeWindow: string;
  visitWelcome: boolean;
  note: string;
  googleUrl: string;
  icsUrl: string;
  signups: { id: number; helperName: string; dish: string; note: string }[];
};

const lineInput = "input-line w-full text-base";

function formatDateLong(isoDate: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${isoDate}T00:00:00`));
}

function formatDateShort(isoDate: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "long",
  }).format(new Date(`${isoDate}T00:00:00`));
}

export function HelperCalendar({
  publicToken,
  days,
  initialSelected,
  todayIso,
}: {
  publicToken: string;
  days: HelperDay[];
  initialSelected: string | null;
  todayIso: string;
}) {
  const [selected, setSelected] = useState<string | null>(initialSelected);

  const markers = useMemo(() => {
    const m: Record<string, DayMarker> = {};
    for (const day of days) {
      m[day.date] = day.signups.length > 0 ? "taken" : "free";
    }
    return m;
  }, [days]);

  const day = days.find((d) => d.date === selected);

  return (
    <div>
      <MonthCalendar
        mode="pick-marked"
        markers={markers}
        minDate={todayIso}
        selected={selected ? [selected] : []}
        onPick={(iso) => setSelected(iso === selected ? null : iso)}
      />

      <div className="mt-3 flex justify-center gap-5 text-xs text-stone-400">
        <span className="flex items-center gap-1.5">
          <span className="chip-warm h-3 w-3 rounded-full ring-1 ring-rose-200" />
          noch frei
        </span>
        <span className="flex items-center gap-1.5">
          <span className="chip-sage h-3 w-3 rounded-full ring-1 ring-emerald-100" />
          schon versorgt
        </span>
      </div>

      {!day && (
        <p className="mt-6 text-center text-stone-400">
          Tippe auf einen markierten Tag, um dich einzutragen 💛
        </p>
      )}

      {day && (
        <div key={day.id} className="card-warm animate-slide-in mt-6 p-6">
          <h3 className="text-xl font-bold text-stone-800">
            {formatDateLong(day.date)}
          </h3>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {day.timeWindow && (
              <span className="chip-warm rounded-full px-3 py-1">
                🕐 {day.timeWindow}
              </span>
            )}
            <span className="chip-warm rounded-full px-3 py-1">
              {day.visitWelcome
                ? "🤗 Kurzer Besuch ist willkommen"
                : "🚪 Bitte vor die Tür stellen"}
            </span>
          </div>
          {day.note && <p className="mt-3 text-stone-500">💬 {day.note}</p>}

          {day.signups.length > 0 && (
            <div className="mt-5">
              <p className="text-sm font-semibold text-stone-600">
                An diesem Tag gibt es schon:
              </p>
              <ul className="mt-2 space-y-2">
                {day.signups.map((signup) => (
                  <li
                    key={signup.id}
                    className="rounded-2xl bg-gradient-to-br from-[#FBF1E9] to-[#F9EAE4] p-4"
                  >
                    <p className="font-semibold text-stone-700">
                      💛 {signup.helperName} bringt {signup.dish}
                    </p>
                    {signup.note && (
                      <p className="mt-0.5 text-sm text-stone-500">{signup.note}</p>
                    )}
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs text-stone-400 hover:text-stone-600">
                        Das bin ich – Eintrag ändern
                      </summary>
                      <form
                        action={updateSignup.bind(null, publicToken, signup.id)}
                        className="mt-3 space-y-3"
                      >
                        <input
                          name="helperName"
                          required
                          maxLength={100}
                          defaultValue={signup.helperName}
                          aria-label="Name"
                          className={lineInput}
                        />
                        <input
                          name="dish"
                          required
                          maxLength={200}
                          defaultValue={signup.dish}
                          aria-label="Gericht"
                          className={lineInput}
                        />
                        <input
                          name="note"
                          maxLength={500}
                          defaultValue={signup.note}
                          placeholder="Notiz (optional)"
                          aria-label="Notiz"
                          className={lineInput}
                        />
                        <button
                          type="submit"
                          className="rounded-full bg-stone-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-stone-700"
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
                          className="text-xs text-stone-400 hover:text-rose-500"
                        >
                          Eintrag löschen
                        </button>
                      </form>
                    </details>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-sm text-stone-400">
                Es darf gern noch jemand etwas dazulegen – Nachtisch ist nie
                verkehrt. 🍰
              </p>
            </div>
          )}

          <form
            action={createSignup.bind(null, publicToken, day.id)}
            className="mt-6"
          >
            <p className="font-semibold text-stone-700">
              🍲 Ich bringe an diesem Tag etwas vorbei
            </p>
            <div className="mt-4 space-y-5">
              <input
                name="helperName"
                required
                maxLength={100}
                placeholder="Dein Name"
                aria-label="Dein Name"
                className="input-line w-full text-lg"
              />
              <input
                name="dish"
                required
                maxLength={200}
                placeholder="Was bringst du mit? – z.B. Lasagne und Salat"
                aria-label="Was bringst du mit?"
                className="input-line w-full text-lg"
              />
              <input
                name="note"
                maxLength={500}
                placeholder="Noch etwas? – z.B. ich komme gegen 18 Uhr (optional)"
                aria-label="Notiz"
                className="input-line w-full text-lg"
              />
            </div>
            <button
              type="submit"
              className="btn-warm mt-7 w-full rounded-full px-6 py-3.5 text-lg font-semibold text-white"
            >
              Eintragen 💛
            </button>
          </form>
        </div>
      )}

      {/* Übersicht: was schon gekocht wird */}
      {days.length > 0 && (
        <section className="mt-12">
          <h3 className="text-center text-xl font-bold text-stone-800">
            Was schon gekocht wird
          </h3>
          <p className="font-hand mt-1 text-center text-2xl text-rose-400">
            das Menü der nächsten Tage
          </p>
          <ul className="mt-5 space-y-2">
            {days.map((d) => (
              <li key={d.id}>
                <button
                  type="button"
                  onClick={() => setSelected(d.date)}
                  className={`w-full rounded-3xl p-4 text-left transition ${
                    d.date === selected
                      ? "card-warm ring-2 ring-rose-300"
                      : d.signups.length > 0
                        ? "card-warm hover:brightness-[1.02]"
                        : "border-2 border-dashed border-rose-200 bg-transparent hover:bg-rose-50/40"
                  }`}
                >
                  <p className="text-sm font-semibold text-stone-500">
                    {formatDateShort(d.date)}
                  </p>
                  {d.signups.length > 0 ? (
                    <ul className="mt-1 space-y-0.5">
                      {d.signups.map((signup) => (
                        <li key={signup.id} className="text-stone-700">
                          <span className="font-semibold">{signup.helperName}:</span>{" "}
                          {signup.dish}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-rose-400">
                      noch frei – trag dich ein 💛
                    </p>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
