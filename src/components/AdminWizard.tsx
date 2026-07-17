"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { completeSetup } from "@/app/actions";
import { MonthCalendar } from "@/components/MonthCalendar";

const bigTextarea =
  "w-full rounded-2xl border-2 border-rose-100 bg-white px-5 py-4 text-lg text-stone-800 placeholder:text-stone-300 focus:border-rose-300 focus:outline-none";

function todayIso(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function AdminWizard({
  adminToken,
  recipientName,
}: {
  adminToken: string;
  recipientName: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [allergies, setAllergies] = useState("");
  const [generalNotes, setGeneralNotes] = useState("");
  const [dates, setDates] = useState<string[]>([]);
  const [timeWindow, setTimeWindow] = useState("");
  const [visitWelcome, setVisitWelcome] = useState(false);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [pending, startTransition] = useTransition();

  const totalSteps = 6;

  function toggleDate(iso: string) {
    setDates((prev) =>
      prev.includes(iso) ? prev.filter((d) => d !== iso) : [...prev, iso].sort()
    );
  }

  function finish() {
    startTransition(async () => {
      await completeSetup(adminToken, {
        allergies,
        generalNotes,
        dates,
        timeWindow,
        visitWelcome,
        notifyEmail,
      });
      router.refresh();
    });
  }

  function NavButtons({
    nextLabel = "Weiter",
    onNext,
    nextDisabled = false,
  }: {
    nextLabel?: string;
    onNext: () => void;
    nextDisabled?: boolean;
  }) {
    return (
      <div className="mt-8 flex items-center gap-3">
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="rounded-full px-4 py-3 text-sm font-medium text-stone-400 transition hover:text-stone-600"
          >
            ← Zurück
          </button>
        )}
        <button
          type="button"
          onClick={onNext}
          disabled={nextDisabled || pending}
          className="flex-1 rounded-full bg-rose-400 px-6 py-3.5 text-lg font-semibold text-white shadow-md shadow-rose-200 transition hover:bg-rose-500 disabled:opacity-40"
        >
          {nextLabel}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-5 py-14">
      {step > 0 && (
        <div className="mb-8 flex justify-center gap-2">
          {Array.from({ length: totalSteps - 1 }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition ${
                i < step ? "bg-rose-400" : "bg-rose-100"
              }`}
            />
          ))}
        </div>
      )}

      {step === 0 && (
        <div className="animate-slide-in text-center">
          <div className="text-6xl">🕊️</div>
          <h1 className="mt-5 text-3xl font-bold text-stone-800">
            Schön, dass ihr da seid
          </h1>
          <p className="font-hand mt-2 text-3xl text-rose-400">
            alles Liebe zum Baby!
          </p>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-stone-500">
            In den nächsten Minuten richten wir euren Essensplan ein. Ein paar
            kleine Fragen – ganz in eurem Tempo, alles lässt sich später ändern.
          </p>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="mt-8 rounded-full bg-rose-400 px-10 py-3.5 text-lg font-semibold text-white shadow-md shadow-rose-200 transition hover:bg-rose-500"
          >
            Los geht&rsquo;s
          </button>
        </div>
      )}

      {step === 1 && (
        <div key="s1" className="animate-slide-in">
          <h2 className="text-2xl font-bold text-stone-800">
            Gibt es Allergien oder Unverträglichkeiten?
          </h2>
          <p className="mt-1 text-stone-500">
            Damit alle wissen, was auf den Tisch darf. Ihr könnt das Feld auch
            leer lassen.
          </p>
          <textarea
            autoFocus
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="z.B. keine Nüsse, laktosefrei, vegetarisch bevorzugt …"
            className={`mt-6 ${bigTextarea}`}
          />
          <p className="mt-2 text-xs text-stone-400">
            Diese Angaben sieht jeder mit eurem Link – tragt nur ein, was eure
            Helfer wirklich wissen müssen.
          </p>
          <NavButtons onNext={() => setStep(2)} />
        </div>
      )}

      {step === 2 && (
        <div key="s2" className="animate-slide-in">
          <h2 className="text-2xl font-bold text-stone-800">
            Was sollten eure Helfer noch wissen?
          </h2>
          <p className="mt-1 text-stone-500">
            Zum Beispiel eure Adresse, oder kleine Bitten – auch das ist
            freiwillig.
          </p>
          <textarea
            autoFocus
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            rows={4}
            maxLength={2000}
            placeholder="z.B. Musterstraße 12 · Boxen bitte beschriften, wir geben alles zurück …"
            className={`mt-6 ${bigTextarea}`}
          />
          <p className="mt-2 text-xs text-stone-400">
            Auch das sieht jeder mit eurem Link – die Adresse könnt ihr z.B.
            auch erst auf Nachfrage teilen.
          </p>
          <NavButtons onNext={() => setStep(3)} />
        </div>
      )}

      {step === 3 && (
        <div key="s3" className="animate-slide-in">
          <h2 className="text-2xl font-bold text-stone-800">
            An welchen Tagen wünscht ihr euch Essen?
          </h2>
          <p className="mt-1 text-stone-500">
            Tippt einfach alle Tage an, die euch guttun würden.
          </p>
          <div className="mt-6">
            <MonthCalendar
              mode="pick-future"
              minDate={todayIso()}
              selected={dates}
              onPick={toggleDate}
            />
          </div>
          <p className="mt-3 text-center text-sm text-stone-400">
            {dates.length === 0
              ? "Noch keine Tage ausgewählt"
              : `${dates.length} ${dates.length === 1 ? "Tag" : "Tage"} ausgewählt 💛`}
          </p>
          <NavButtons onNext={() => setStep(4)} nextDisabled={dates.length === 0} />
        </div>
      )}

      {step === 4 && (
        <div key="s4" className="animate-slide-in">
          <h2 className="text-2xl font-bold text-stone-800">
            Wann und wie passt es euch am besten?
          </h2>
          <p className="mt-1 text-stone-500">
            Das gilt erstmal für alle Tage – einzelne Tage könnt ihr danach noch
            anpassen.
          </p>

          <label className="mt-6 block text-sm font-semibold text-stone-600">
            Beste Uhrzeit für die Übergabe
          </label>
          <input
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
            maxLength={100}
            placeholder="z.B. zwischen 17 und 19 Uhr"
            className="mt-2 w-full rounded-2xl border-2 border-rose-100 bg-white px-5 py-4 text-lg text-stone-800 placeholder:text-stone-300 focus:border-rose-300 focus:outline-none"
          />

          <p className="mt-6 text-sm font-semibold text-stone-600">
            Wie soll das Essen zu euch kommen?
          </p>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setVisitWelcome(false)}
              className={`rounded-2xl border-2 p-5 text-left transition ${
                !visitWelcome
                  ? "border-rose-300 bg-rose-50"
                  : "border-rose-100 bg-white hover:border-rose-200"
              }`}
            >
              <div className="text-3xl">🚪</div>
              <p className="mt-2 font-semibold text-stone-700">
                Vor die Tür stellen
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Kein Klingeln, keine Pflicht zu reden – einfach ankommen lassen.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setVisitWelcome(true)}
              className={`rounded-2xl border-2 p-5 text-left transition ${
                visitWelcome
                  ? "border-rose-300 bg-rose-50"
                  : "border-rose-100 bg-white hover:border-rose-200"
              }`}
            >
              <div className="text-3xl">🤗</div>
              <p className="mt-2 font-semibold text-stone-700">
                Kurzer Besuch ist schön
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Wir freuen uns über ein kurzes Hallo an der Tür.
              </p>
            </button>
          </div>

          <NavButtons onNext={() => setStep(5)} />
        </div>
      )}

      {step === 5 && (
        <div key="s5" className="animate-slide-in">
          <h2 className="text-2xl font-bold text-stone-800">
            Möchtet ihr Bescheid bekommen?
          </h2>
          <p className="mt-1 text-stone-500">
            Wenn ihr mögt, schicken wir euch eine kleine Mail, sobald sich
            jemand einträgt. Freiwillig – und jederzeit abschaltbar.
          </p>
          <input
            autoFocus
            type="email"
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
            maxLength={200}
            placeholder="eure@email.de (optional)"
            className="mt-6 w-full rounded-2xl border-2 border-rose-100 bg-white px-5 py-4 text-lg text-stone-800 placeholder:text-stone-300 focus:border-rose-300 focus:outline-none"
          />
          <p className="mt-2 text-xs text-stone-400">
            Die Adresse wird nur für diese Benachrichtigungen genutzt und mit
            dem Plan gelöscht.
          </p>
          <NavButtons
            nextLabel={pending ? "Wird gespeichert …" : "Fertig – Plan anlegen 🌷"}
            onNext={finish}
          />
        </div>
      )}
    </div>
  );
}
