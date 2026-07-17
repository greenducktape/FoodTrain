import { neon } from "@neondatabase/serverless";
import { drizzle as drizzleNeon, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = NeonHttpDatabase<typeof schema>;

let cached: Db | undefined;

function createDb(): Db {
  const url = process.env.DATABASE_URL;
  if (url) {
    return drizzleNeon(neon(url), { schema });
  }

  if (process.env.NODE_ENV !== "production") {
    // Lokale Entwicklung ohne Neon: eingebettete Postgres-Datenbank (PGlite),
    // gespeichert im Ordner ./.pglite
    const { PGlite } =
      require("@electric-sql/pglite") as typeof import("@electric-sql/pglite");
    const { drizzle: drizzlePglite } =
      require("drizzle-orm/pglite") as typeof import("drizzle-orm/pglite");
    return drizzlePglite(new PGlite("./.pglite"), { schema }) as unknown as Db;
  }

  throw new Error("DATABASE_URL ist nicht gesetzt (siehe .env.example)");
}

// Lazy initialisiert, damit der Build auch ohne DATABASE_URL funktioniert –
// die Verbindung wird erst beim ersten Query aufgebaut.
export const db = new Proxy({} as Db, {
  get(_target, prop) {
    cached ??= createDb();
    const value = Reflect.get(cached, prop, cached);
    return typeof value === "function" ? value.bind(cached) : value;
  },
});
