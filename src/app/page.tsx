import { createPlan } from "./actions";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-lg px-4 py-12">
      <div className="text-center">
        <div className="text-5xl">🍲</div>
        <h1 className="mt-4 text-3xl font-bold text-stone-900">Essensplan</h1>
        <p className="mt-3 text-stone-600">
          Organisiert gemeinsam Essen für eine Familie, die gerade ein Kind
          bekommen hat – oder für jeden anderen Anlass, bei dem Unterstützung
          guttut.
        </p>
      </div>

      <div className="mt-10 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h2 className="text-lg font-semibold text-stone-900">
          Neuen Essensplan erstellen
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Du bekommst danach zwei Links: einen privaten Link zum Verwalten und
          einen öffentlichen Link zum Teilen mit allen Helferinnen und Helfern.
        </p>

        <form action={createPlan} className="mt-6 space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-stone-700">
              Titel des Plans
            </label>
            <input
              id="title"
              name="title"
              required
              maxLength={200}
              placeholder="z.B. Essen für Familie Müller"
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
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
              placeholder="z.B. Anna & Tom"
              className="mt-1 w-full rounded-lg border border-stone-300 px-3 py-2 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-amber-600 px-4 py-2.5 font-semibold text-white transition hover:bg-amber-700"
          >
            Plan erstellen
          </button>
        </form>
      </div>

      <div className="mt-8 space-y-3 text-sm text-stone-500">
        <p>
          <span className="font-medium text-stone-700">So funktioniert’s:</span>
        </p>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Plan erstellen und Wunschtage, Uhrzeiten &amp; Allergien eintragen.</li>
          <li>Öffentlichen Link an Freunde, Familie oder die Gemeinde schicken.</li>
          <li>Alle tragen sich mit ihrem Gericht an einem freien Tag ein. Fertig!</li>
        </ol>
      </div>
    </main>
  );
}
