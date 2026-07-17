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
