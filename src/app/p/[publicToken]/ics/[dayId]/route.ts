import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { planDays, plans } from "@/db/schema";
import { buildIcs } from "@/lib/calendar";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ publicToken: string; dayId: string }> }
) {
  const { publicToken, dayId } = await params;

  const [plan] = await db
    .select()
    .from(plans)
    .where(eq(plans.publicToken, publicToken));
  if (!plan) return new Response("Nicht gefunden", { status: 404 });

  const [day] = await db
    .select()
    .from(planDays)
    .where(and(eq(planDays.id, Number(dayId)), eq(planDays.planId, plan.id)));
  if (!day) return new Response("Nicht gefunden", { status: 404 });

  return new Response(buildIcs(day, plan), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="essensplan-${day.date}.ics"`,
    },
  });
}
