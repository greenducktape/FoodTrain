import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-24 text-center">
      <div className="text-4xl">🤔</div>
      <h1 className="mt-4 text-2xl font-bold text-stone-900">
        Seite nicht gefunden
      </h1>
      <p className="mt-2 text-stone-600">
        Dieser Link ist ungültig oder der Plan existiert nicht mehr. Prüfe, ob
        der Link vollständig kopiert wurde.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white transition hover:bg-amber-700"
      >
        Zur Startseite
      </Link>
    </main>
  );
}
