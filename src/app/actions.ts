"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { planDays, plans, signups, type Plan } from "@/db/schema";
import { generateToken } from "@/lib/token";

function cleanText(value: FormDataEntryValue | null, maxLength = 2000): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function requireText(value: FormDataEntryValue | null, field: string, maxLength = 200): string {
  const text = cleanText(value, maxLength);
  if (!text) throw new Error(`Feld "${field}" darf nicht leer sein.`);
  return text;
}

async function getPlanByAdminToken(adminToken: string): Promise<Plan> {
  const [plan] = await db
    .select()
    .from(plans)
    .where(eq(plans.adminToken, adminToken));
  if (!plan) throw new Error("Plan nicht gefunden.");
  return plan;
}

async function getPlanByPublicToken(publicToken: string): Promise<Plan> {
  const [plan] = await db
    .select()
    .from(plans)
    .where(eq(plans.publicToken, publicToken));
  if (!plan) throw new Error("Plan nicht gefunden.");
  return plan;
}

function revalidatePlan(plan: Plan) {
  revalidatePath(`/a/${plan.adminToken}`);
  revalidatePath(`/p/${plan.publicToken}`);
}

export async function createPlan(formData: FormData) {
  const title = requireText(formData.get("title"), "Titel");
  const recipientName = requireText(formData.get("recipientName"), "Name");

  const adminToken = generateToken();
  const publicToken = generateToken();

  await db.insert(plans).values({
    adminToken,
    publicToken,
    title,
    recipientName,
  });

  redirect(`/a/${adminToken}`);
}

export async function updatePlanDetails(adminToken: string, formData: FormData) {
  const plan = await getPlanByAdminToken(adminToken);

  await db
    .update(plans)
    .set({
      title: requireText(formData.get("title"), "Titel"),
      recipientName: requireText(formData.get("recipientName"), "Name"),
      allergies: cleanText(formData.get("allergies")),
      generalNotes: cleanText(formData.get("generalNotes")),
    })
    .where(eq(plans.id, plan.id));

  revalidatePlan(plan);
}

export async function completeSetup(
  adminToken: string,
  payload: {
    allergies: string;
    generalNotes: string;
    dates: string[];
    timeWindow: string;
    visitWelcome: boolean;
  }
) {
  const plan = await getPlanByAdminToken(adminToken);

  const dates = [...new Set(payload.dates)]
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .slice(0, 90);

  await db
    .update(plans)
    .set({
      allergies: payload.allergies.trim().slice(0, 2000),
      generalNotes: payload.generalNotes.trim().slice(0, 2000),
    })
    .where(eq(plans.id, plan.id));

  if (dates.length > 0) {
    await db.insert(planDays).values(
      dates.map((date) => ({
        planId: plan.id,
        date,
        timeWindow: payload.timeWindow.trim().slice(0, 100),
        visitWelcome: payload.visitWelcome,
      }))
    );
  }

  revalidatePlan(plan);
}

export async function addDay(adminToken: string, formData: FormData) {
  const plan = await getPlanByAdminToken(adminToken);

  const date = requireText(formData.get("date"), "Datum", 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Ungültiges Datum.");
  }

  await db.insert(planDays).values({
    planId: plan.id,
    date,
    timeWindow: cleanText(formData.get("timeWindow"), 100),
    visitWelcome: formData.get("visitWelcome") === "on",
    note: cleanText(formData.get("note"), 500),
  });

  revalidatePlan(plan);
}

export async function updateDay(adminToken: string, dayId: number, formData: FormData) {
  const plan = await getPlanByAdminToken(adminToken);

  await db
    .update(planDays)
    .set({
      timeWindow: cleanText(formData.get("timeWindow"), 100),
      visitWelcome: formData.get("visitWelcome") === "on",
      note: cleanText(formData.get("note"), 500),
    })
    .where(and(eq(planDays.id, dayId), eq(planDays.planId, plan.id)));

  revalidatePlan(plan);
}

export async function deleteDay(adminToken: string, dayId: number) {
  const plan = await getPlanByAdminToken(adminToken);

  await db
    .delete(planDays)
    .where(and(eq(planDays.id, dayId), eq(planDays.planId, plan.id)));

  revalidatePlan(plan);
}

async function assertSignupBelongsToPlan(signupId: number, planId: number) {
  const [row] = await db
    .select({ id: signups.id })
    .from(signups)
    .innerJoin(planDays, eq(signups.planDayId, planDays.id))
    .where(and(eq(signups.id, signupId), eq(planDays.planId, planId)));
  if (!row) throw new Error("Eintrag nicht gefunden.");
}

export async function adminDeleteSignup(adminToken: string, signupId: number) {
  const plan = await getPlanByAdminToken(adminToken);
  await assertSignupBelongsToPlan(signupId, plan.id);

  await db.delete(signups).where(eq(signups.id, signupId));

  revalidatePlan(plan);
}

export async function createSignup(publicToken: string, dayId: number, formData: FormData) {
  const plan = await getPlanByPublicToken(publicToken);

  const [day] = await db
    .select()
    .from(planDays)
    .where(and(eq(planDays.id, dayId), eq(planDays.planId, plan.id)));
  if (!day) throw new Error("Tag nicht gefunden.");

  await db.insert(signups).values({
    planDayId: day.id,
    helperName: requireText(formData.get("helperName"), "Name", 100),
    dish: requireText(formData.get("dish"), "Gericht", 200),
    note: cleanText(formData.get("note"), 500),
  });

  revalidatePlan(plan);
  redirect(`/p/${plan.publicToken}?danke=${day.id}`);
}

export async function updateSignup(publicToken: string, signupId: number, formData: FormData) {
  const plan = await getPlanByPublicToken(publicToken);
  await assertSignupBelongsToPlan(signupId, plan.id);

  await db
    .update(signups)
    .set({
      helperName: requireText(formData.get("helperName"), "Name", 100),
      dish: requireText(formData.get("dish"), "Gericht", 200),
      note: cleanText(formData.get("note"), 500),
    })
    .where(eq(signups.id, signupId));

  revalidatePlan(plan);
}

export async function deleteSignup(publicToken: string, signupId: number) {
  const plan = await getPlanByPublicToken(publicToken);
  await assertSignupBelongsToPlan(signupId, plan.id);

  await db.delete(signups).where(eq(signups.id, signupId));

  revalidatePlan(plan);
}
