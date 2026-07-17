import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite (lokale Dev-Datenbank) nicht bündeln, damit seine WASM-Dateien
  // direkt aus node_modules geladen werden
  serverExternalPackages: ["@electric-sql/pglite"],
};

export default nextConfig;
