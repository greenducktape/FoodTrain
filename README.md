# Essensplan 🍲

Eine kleine Web-App, um gemeinsam Essen für eine Familie zu organisieren, die
gerade Unterstützung braucht (z.B. nach der Geburt eines Kindes).

## So funktioniert's

1. Auf der Startseite einen neuen Plan erstellen.
2. Die Familie bekommt zwei Links:
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
cp .env.example .env.local   # DATABASE_URL eintragen (Neon Connection String)
npm run db:push              # Tabellen anlegen
npm run dev                  # http://localhost:3000
```

## Deployment (Vercel)

1. Repo auf GitHub pushen.
2. Auf [vercel.com](https://vercel.com) das Repo als neues Projekt importieren.
3. Im Projekt unter **Storage → Create Database → Neon** eine Postgres-Datenbank
   anlegen – `DATABASE_URL` wird automatisch gesetzt.
4. Einmalig lokal `npm run db:push` mit der Neon-`DATABASE_URL` ausführen
   (oder `vercel env pull .env.local` und dann `npm run db:push`).
5. Deployen – fertig.
