import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-5 py-24 text-center">
      <div className="text-5xl">🕊️</div>
      <h1 className="mt-5 text-3xl font-bold text-stone-800">
        Diese Seite gibt es nicht
      </h1>
      <p className="mt-3 text-lg leading-relaxed text-stone-500">
        Der Link ist ungültig oder der Plan existiert nicht mehr. Prüfe, ob der
        Link vollständig kopiert wurde.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-rose-400 px-8 py-3 font-semibold text-white shadow-md shadow-rose-200 transition hover:bg-rose-500"
      >
        Zur Startseite
      </Link>
    </main>
  );
}
