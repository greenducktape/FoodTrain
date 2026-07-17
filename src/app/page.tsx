import Link from "next/link";
import { CreatePlanWizard } from "@/components/CreatePlanWizard";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-lg px-5 py-14">
      <div className="text-center">
        <div className="text-6xl">🌷</div>
        <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-stone-800">
          Kochkette
        </h1>
        <p className="font-hand mt-2 text-3xl text-rose-400">
          von Herzen gekocht
        </p>
        <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-stone-500">
          Wenn ein kleiner Mensch ankommt, ist ein warmes Essen vor der Tür ein
          großes Geschenk. Hier organisiert ihr das ganz einfach – gemeinsam.
        </p>
      </div>

      <div className="mt-12 rounded-3xl bg-white p-7 shadow-sm ring-1 ring-rose-100 sm:p-9">
        <CreatePlanWizard />
      </div>

      <div className="mt-14 space-y-6">
        {[
          {
            emoji: "🗓️",
            title: "Wunschtage auswählen",
            text: "Die Familie wählt im Kalender, an welchen Tagen sie sich Essen wünscht – und trägt Allergien und Wünsche ein.",
          },
          {
            emoji: "💌",
            title: "Link verschicken",
            text: "Ein Link an Freunde, Familie oder die Gemeinde – mehr braucht es nicht. Kein Konto, keine App.",
          },
          {
            emoji: "🍲",
            title: "Eintragen & vorbeibringen",
            text: "Alle suchen sich einen freien Tag aus und tragen ein, was sie mitbringen. Mit Erinnerung im eigenen Kalender.",
          },
        ].map((item) => (
          <div key={item.title} className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm ring-1 ring-rose-100">
              {item.emoji}
            </div>
            <div>
              <p className="font-semibold text-stone-700">{item.title}</p>
              <p className="mt-0.5 leading-relaxed text-stone-500">{item.text}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-16 text-center text-sm text-stone-400">
        Mit 💛 gemacht für die ersten Wochen zu Hause
      </p>
      <p className="mt-3 text-center text-xs text-stone-300">
        <Link href="/datenschutz" className="hover:text-stone-500">
          Datenschutz
        </Link>
        {" · "}
        <Link href="/impressum" className="hover:text-stone-500">
          Impressum
        </Link>
      </p>
    </main>
  );
}
