import type { Metadata } from "next";
import { Fraunces, Karla, Shadows_Into_Light } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});

const shadows = Shadows_Into_Light({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-shadows",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kochkette – von Herzen gekocht",
  description:
    "Gemeinsam Essen organisieren für Menschen, die gerade Liebe und Unterstützung brauchen.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body
        className={`${fraunces.variable} ${karla.variable} ${shadows.variable} min-h-screen font-sans text-stone-700 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
