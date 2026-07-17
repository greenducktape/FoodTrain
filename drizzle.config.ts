import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

config({ path: ".env.local" });

// Mit DATABASE_URL (lokal via .env.local, auf Vercel automatisch gesetzt):
// echte Neon/Postgres-Datenbank. Ohne: eingebettete PGlite-DB für lokale Tests.
export default defineConfig(
  process.env.DATABASE_URL
    ? {
        schema: "./src/db/schema.ts",
        dialect: "postgresql",
        dbCredentials: { url: process.env.DATABASE_URL },
      }
    : {
        schema: "./src/db/schema.ts",
        dialect: "postgresql",
        driver: "pglite",
        dbCredentials: { url: "./.pglite" },
      }
);
