import Link from "next/link";

export const metadata = { title: "Datenschutz – Kochkette" };

export default function DatenschutzPage() {
  return (
    <main className="mx-auto max-w-xl px-5 py-12">
      <h1 className="text-3xl font-bold text-stone-800">Datenschutz</h1>
      <p className="mt-2 text-stone-500">
        Kurz und ehrlich – so gehen wir mit euren Daten um.
      </p>

      <div className="mt-8 space-y-6 leading-relaxed text-stone-600">
        <section>
          <h2 className="text-lg font-bold text-stone-800">
            Welche Daten wir speichern
          </h2>
          <p className="mt-1">
            Nur, was ihr selbst eintragt: den Namen des Plans, wer das Essen
            bekommt, Wunschtage mit Uhrzeiten und Notizen, freiwillige Angaben
            zu Allergien und Hinweisen, die Namen und Gerichte der Helferinnen
            und Helfer sowie – falls gewünscht – eine E-Mail-Adresse für
            Benachrichtigungen. Es gibt keine Konten, keine Passwörter, kein
            Tracking, keine Analyse-Cookies und keine Werbung.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800">
            Wer die Daten sehen kann
          </h2>
          <p className="mt-1">
            Alle Angaben eines Plans sind für jede Person sichtbar, die den
            jeweiligen Link kennt. Die Links sind lang und nicht erratbar –
            teilt sie deshalb nur mit Menschen, denen ihr vertraut, und tragt
            nur ein, was eure Helfer wirklich wissen müssen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800">
            Wo die Daten liegen
          </h2>
          <p className="mt-1">
            Die Datenbank läuft bei Neon (Region Frankfurt, EU), die Anwendung
            bei Vercel. Falls Mail-Benachrichtigungen aktiviert sind, werden
            diese über Resend versendet. Mit allen Anbietern bestehen
            Auftragsverarbeitungsverträge nach DSGVO.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800">
            Wie lange wir speichern
          </h2>
          <p className="mt-1">
            Pläne, deren letzter Wunschtag mehr als 6 Monate zurückliegt,
            werden automatisch und endgültig gelöscht – samt aller Einträge und
            E-Mail-Adressen. Über den Verwaltungs-Link könnt ihr euren Plan
            außerdem jederzeit selbst vollständig löschen.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-stone-800">Eure Rechte</h2>
          <p className="mt-1">
            Ihr habt das Recht auf Auskunft, Berichtigung und Löschung eurer
            Daten. Das meiste könnt ihr direkt über den Verwaltungs-Link
            erledigen – für alles andere meldet euch einfach über die im
            Impressum genannte Adresse.
          </p>
        </section>
      </div>

      <p className="mt-10 text-center text-xs text-stone-300">
        <Link href="/" className="hover:text-stone-500">
          Zur Startseite
        </Link>
        {" · "}
        <Link href="/impressum" className="hover:text-stone-500">
          Impressum
        </Link>
      </p>
    </main>
  );
}
