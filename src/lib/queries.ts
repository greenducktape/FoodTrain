import { asc, eq, inArray } from "drizzle-orm";
import { db } from "@/db";
import { planDays, signups, type Plan, type PlanDay, type Signup } from "@/db/schema";

export type DayWithSignups = PlanDay & { signups: Signup[] };

export async function loadDaysWithSignups(plan: Plan): Promise<DayWithSignups[]> {
  const days = await db
    .select()
    .from(planDays)
    .where(eq(planDays.planId, plan.id))
    .orderBy(asc(planDays.date), asc(planDays.id));

  if (days.length === 0) return [];

  const allSignups = await db
    .select()
    .from(signups)
    .where(inArray(signups.planDayId, days.map((d) => d.id)))
    .orderBy(asc(signups.createdAt));

  return days.map((day) => ({
    ...day,
    signups: allSignups.filter((s) => s.planDayId === day.id),
  }));
}
