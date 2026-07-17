import type { Metadata } from "next";
import { Caveat, Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Essensplan – von Herzen gekocht",
  description:
    "Gemeinsam Essen organisieren für Menschen, die gerade Liebe und Unterstützung brauchen.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body
        className={`${nunito.variable} ${caveat.variable} min-h-screen bg-[#FDF7F2] font-sans text-stone-700 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
