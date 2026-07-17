import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Essensplan",
  description:
    "Gemeinsam Essen organisieren für Familien, die gerade Unterstützung brauchen.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-amber-50 text-stone-800 antialiased">
        {children}
      </body>
    </html>
  );
}
