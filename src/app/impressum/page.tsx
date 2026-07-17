import Link from "next/link";

export const metadata = { title: "Impressum – Kochkette" };

export default function ImpressumPage() {
  return (
    <main className="mx-auto max-w-xl px-5 py-12">
      <h1 className="text-3xl font-bold text-stone-800">Impressum</h1>

      <div className="mt-8 space-y-2 leading-relaxed text-stone-600">
        <p>Angaben gemäß § 5 DDG:</p>
        {/* TODO: Vor dem öffentlichen Teilen mit echten Angaben füllen */}
        <p className="font-semibold text-stone-800">[Vor- und Nachname]</p>
        <p>[Straße und Hausnummer]</p>
        <p>[PLZ und Ort]</p>
        <p>E-Mail: info@kochkette.com</p>
      </div>

      <p className="mt-8 text-sm text-stone-400">
        Kochkette ist ein privates, nicht-kommerzielles Projekt, um Essen für
        Menschen zu organisieren, die gerade Unterstützung brauchen.
      </p>

      <p className="mt-10 text-center text-xs text-stone-300">
        <Link href="/" className="hover:text-stone-500">
          Zur Startseite
        </Link>
        {" · "}
        <Link href="/datenschutz" className="hover:text-stone-500">
          Datenschutz
        </Link>
      </p>
    </main>
  );
}
