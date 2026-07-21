# Kochkette 🍲

*von Herzen gekocht* — eine kleine Web-App, um gemeinsam Essen für Menschen
zu organisieren, die gerade Unterstützung brauchen — etwa nach einer Geburt,
in einer Krankheitsphase oder nach einem Trauerfall.
Live unter [kochkette.com](https://kochkette.com).

## So funktioniert's

1. Auf der Startseite einen neuen Plan erstellen.
2. Wer bekocht wird, bekommt zwei Links:
   - **Verwaltungs-Link** (`/a/…`): Allergien, Hinweise und Wunschtage pflegen
     (Datum, Uhrzeit-Fenster, Besuch willkommen oder vor die Tür stellen).
   - **Öffentlicher Link** (`/p/…`): wird an Helferinnen und Helfer verschickt.
3. Helfer tragen sich mit Name und Gericht für einen freien Tag ein.

Kein Login nötig – der Zugriff läuft über unerratbare Links.

## Tech-Stack

- [Next.js 15](https://nextjs.org) (App Router, Server Actions)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Drizzle ORM](https://orm.drizzle.team) + [Neon Postgres](https://neon.tech)
- Deployment: [Vercel](https://vercel.com)

## Lokale Entwicklung

```bash
npm install
npm run db:push              # Tabellen anlegen (ohne DATABASE_URL: lokale PGlite-DB)
npm run dev                  # http://localhost:3000
```

Ohne `DATABASE_URL` nutzt die App automatisch eine eingebettete
PGlite-Datenbank im Ordner `.pglite` – es ist also kein Datenbank-Setup
nötig. Für die echte Datenbank: `cp .env.example .env.local` und den
Neon-Connection-String eintragen.

## Deployment (Vercel)

1. Repo auf GitHub pushen.
2. Auf [vercel.com](https://vercel.com) das Repo als neues Projekt importieren.
3. Im Projekt unter **Storage → Create Database → Neon** eine Postgres-Datenbank
   anlegen – `DATABASE_URL` wird automatisch gesetzt.
4. Neu deployen (Deployments → ⋯ → Redeploy) – die Tabellen werden beim Build
   automatisch angelegt (`drizzle-kit push` läuft im Build-Schritt). Fertig.

## Mail-Benachrichtigungen (optional)

Die Empfänger können eine E-Mail hinterlegen und bekommen eine Nachricht, sobald
sich jemand einträgt. Versand über [Resend](https://resend.com):

1. Resend-Konto anlegen, Domain `kochkette.com` verifizieren (DNS-Einträge
   bei Cloudflare setzen).
2. In Vercel die Umgebungsvariablen setzen:
   - `RESEND_API_KEY` – API-Key aus Resend
   - `EMAIL_FROM` – z.B. `Kochkette <post@kochkette.com>` (optional)
   - `APP_URL` – `https://kochkette.com` (für Links in den Mails)
3. Ohne `RESEND_API_KEY` werden einfach keine Mails verschickt – die App
   funktioniert trotzdem vollständig.

## Datenschutz

- Daten liegen bei Neon in Frankfurt (EU), Funktionen laufen in `fra1`.
- Pläne werden 180 Tage nach dem letzten Wunschtag automatisch gelöscht.
- Empfänger können ihren Plan jederzeit selbst vollständig löschen.
- Vor dem öffentlichen Teilen: Platzhalter in `src/app/impressum/page.tsx`
  mit echten Angaben füllen.
