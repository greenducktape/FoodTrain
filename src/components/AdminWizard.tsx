"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { completeSetup } from "@/app/actions";
import { MonthCalendar } from "@/components/MonthCalendar";

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

  const contentSteps = 3;

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
          className="btn-warm flex-1 rounded-full px-6 py-3.5 text-lg font-semibold text-white disabled:opacity-40"
        >
          {nextLabel}
        </button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-5 py-14">
      {step > 0 && (
        <div className="mb-8 flex justify-center gap-2">
          {Array.from({ length: contentSteps }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 w-8 rounded-full transition ${
                i < step ? "btn-warm" : "bg-rose-100"
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
            Drei kleine Fragen, dann steht euer Plan für {recipientName}. Alles
            ist freiwillig und lässt sich später ändern.
          </p>
          <button
            type="button"
            onClick={() => setStep(1)}
            className="btn-warm mt-8 rounded-full px-10 py-3.5 text-lg font-semibold text-white"
          >
            Los geht&rsquo;s
          </button>
        </div>
      )}

      {step === 1 && (
        <div key="s1" className="animate-slide-in">
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
          <NavButtons onNext={() => setStep(2)} nextDisabled={dates.length === 0} />
        </div>
      )}

      {step === 2 && (
        <div key="s2" className="animate-slide-in">
          <h2 className="text-2xl font-bold text-stone-800">
            Was sollten eure Helfer wissen?
          </h2>
          <p className="mt-1 text-stone-500">
            Beides ist freiwillig – ihr könnt auch einfach weiterklicken.
          </p>

          <label className="mt-8 block text-sm font-semibold text-stone-600">
            Allergien &amp; Unverträglichkeiten
          </label>
          <textarea
            autoFocus
            value={allergies}
            onChange={(e) => setAllergies(e.target.value)}
            rows={2}
            maxLength={2000}
            placeholder="z.B. keine Nüsse, laktosefrei …"
            className="input-line mt-1 w-full text-lg"
          />

          <label className="mt-7 block text-sm font-semibold text-stone-600">
            Hinweise – Adresse, kleine Bitten …
          </label>
          <textarea
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            rows={2}
            maxLength={2000}
            placeholder="z.B. Blumenweg 7 · Boxen bitte beschriften …"
            className="input-line mt-1 w-full text-lg"
          />

          <p className="mt-3 text-xs text-stone-400">
            Beides sieht jeder mit eurem Link – tragt nur ein, was eure Helfer
            wirklich brauchen.
          </p>
          <NavButtons onNext={() => setStep(3)} />
        </div>
      )}

      {step === 3 && (
        <div key="s3" className="animate-slide-in">
          <h2 className="text-2xl font-bold text-stone-800">
            Wie soll das Essen zu euch kommen?
          </h2>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setVisitWelcome(false)}
              className={`rounded-3xl p-5 text-left transition ${
                !visitWelcome
                  ? "chip-warm shadow-md ring-2 ring-rose-300"
                  : "card-warm opacity-70 hover:opacity-100"
              }`}
            >
              <div className="text-3xl">🚪</div>
              <p className="mt-2 font-semibold text-stone-700">
                Vor die Tür stellen
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Kein Klingeln, kein Reden-Müssen.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setVisitWelcome(true)}
              className={`rounded-3xl p-5 text-left transition ${
                visitWelcome
                  ? "chip-warm shadow-md ring-2 ring-rose-300"
                  : "card-warm opacity-70 hover:opacity-100"
              }`}
            >
              <div className="text-3xl">🤗</div>
              <p className="mt-2 font-semibold text-stone-700">
                Kurzer Besuch ist schön
              </p>
              <p className="mt-1 text-sm text-stone-500">
                Wir freuen uns über ein Hallo.
              </p>
            </button>
          </div>

          <label className="mt-8 block text-sm font-semibold text-stone-600">
            Beste Uhrzeit <span className="font-normal text-stone-400">(optional)</span>
          </label>
          <input
            value={timeWindow}
            onChange={(e) => setTimeWindow(e.target.value)}
            maxLength={100}
            placeholder="z.B. zwischen 17 und 19 Uhr"
            className="input-line mt-1 w-full text-lg"
          />

          <label className="mt-7 block text-sm font-semibold text-stone-600">
            E-Mail für Benachrichtigungen{" "}
            <span className="font-normal text-stone-400">(optional)</span>
          </label>
          <input
            type="email"
            value={notifyEmail}
            onChange={(e) => setNotifyEmail(e.target.value)}
            maxLength={200}
            placeholder="eure@email.de – wir sagen Bescheid, wenn sich jemand einträgt"
            className="input-line mt-1 w-full text-lg"
          />

          <NavButtons
            nextLabel={pending ? "Wird gespeichert …" : "Fertig – Plan anlegen 🌷"}
            onNext={finish}
          />
        </div>
      )}
    </main>
  );
}
