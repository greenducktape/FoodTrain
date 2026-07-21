import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HelperCalendar, type HelperDay } from "@/components/HelperCalendar";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { googleCalendarUrl } from "@/lib/calendar";
import { formatDateLong, todayIso } from "@/lib/dates";
import { loadDaysWithSignups } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PublicPage({
  params,
  searchParams,
}: {
  params: Promise<{ publicToken: string }>;
  searchParams: Promise<{ danke?: string }>;
}) {
  const { publicToken } = await params;
  const { danke } = await searchParams;

  const [plan] = await db
    .select()
    .from(plans)
    .where(eq(plans.publicToken, publicToken));
  if (!plan) notFound();

  const allDays = await loadDaysWithSignups(plan);
  const today = todayIso();

  const days: HelperDay[] = allDays
    .filter((day) => day.date >= today)
    .map((day) => ({
      id: day.id,
      date: day.date,
      timeWindow: day.timeWindow,
      visitWelcome: day.visitWelcome,
      note: day.note,
      googleUrl: googleCalendarUrl(day, plan),
      icsUrl: `/p/${publicToken}/ics/${day.id}`,
      signups: day.signups.map((s) => ({
        id: s.id,
        helperName: s.helperName,
        dish: s.dish,
        note: s.note,
      })),
    }));

  const dankeDay = danke
    ? days.find((day) => day.id === Number(danke))
    : undefined;
  const firstFree = days.find((day) => day.signups.length === 0);
  const initialSelected =
    dankeDay?.date ?? firstFree?.date ?? days[0]?.date ?? null;

  return (
    <main className="mx-auto max-w-xl px-5 py-12">
      <div className="text-center">
        <div className="text-5xl">🍲</div>
        <h1 className="mt-4 text-3xl font-bold text-stone-800">{plan.title}</h1>
        <p className="font-hand mt-1 text-3xl text-rose-400">
          von Herzen gekocht
        </p>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-stone-500">
          Such dir unten einen Tag aus und trag ein, was du{" "}
          <span className="font-semibold text-stone-600">{plan.recipientName}</span>{" "}
          vorbeibringen möchtest. Danke, dass du da bist! 💛
        </p>
      </div>

      {dankeDay && (
        <section className="mt-8 rounded-3xl bg-gradient-to-b from-[#F1F8F1] to-[#E5F1E8] p-6 text-center shadow-[0_14px_34px_-16px_rgba(95,164,113,0.35)] ring-1 ring-emerald-100">
          <p className="text-2xl">💛</p>
          <p className="mt-2 text-lg font-bold text-emerald-800">
            Danke dir – du bist eingetragen!
          </p>
          <p className="mt-1 text-emerald-700">
            Am {formatDateLong(dankeDay.date)} freuen sich {plan.recipientName}{" "}
            auf dich.
          </p>
          <p className="mt-4 text-sm font-semibold text-emerald-800">
            Als Erinnerung in deinen Kalender:
          </p>
          <div className="mt-2 flex flex-col justify-center gap-2 sm:flex-row">
            <a
              href={dankeDay.googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
            >
              📅 Google Kalender
            </a>
            <a
              href={dankeDay.icsUrl}
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-200 transition hover:bg-emerald-100"
            >
              📅 Apple / Outlook (.ics)
            </a>
          </div>
        </section>
      )}

      {(plan.allergies || plan.generalNotes) && (
        <section className="mt-8 space-y-3">
          {plan.allergies && (
            <div className="card-warm p-5">
              <p className="font-semibold text-stone-700">
                🌿 Bitte beim Kochen beachten
              </p>
              <p className="mt-1 whitespace-pre-line leading-relaxed text-stone-500">
                {plan.allergies}
              </p>
            </div>
          )}
          {plan.generalNotes && (
            <div className="card-warm p-5">
              <p className="font-semibold text-stone-700">💬 Gut zu wissen</p>
              <p className="mt-1 whitespace-pre-line leading-relaxed text-stone-500">
                {plan.generalNotes}
              </p>
            </div>
          )}
        </section>
      )}

      <section className="mt-8">
        {days.length === 0 ? (
          <p className="card-warm p-8 text-center text-stone-400">
            Gerade sind keine offenen Tage eingetragen – schau bald wieder
            vorbei. 💛
          </p>
        ) : (
          <HelperCalendar
            publicToken={publicToken}
            days={days}
            initialSelected={initialSelected}
            todayIso={today}
          />
        )}
      </section>

      <p className="mt-14 text-center text-sm text-stone-400">
        Mit 💛 organisiert über Kochkette
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
