import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  adminToken: text("admin_token").notNull().unique(),
  publicToken: text("public_token").notNull().unique(),
  title: text("title").notNull(),
  recipientName: text("recipient_name").notNull(),
  allergies: text("allergies").notNull().default(""),
  generalNotes: text("general_notes").notNull().default(""),
  notifyEmail: text("notify_email").notNull().default(""),
  notifyEnabled: boolean("notify_enabled").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const planDays = pgTable("plan_days", {
  id: serial("id").primaryKey(),
  planId: integer("plan_id")
    .notNull()
    .references(() => plans.id, { onDelete: "cascade" }),
  date: date("date", { mode: "string" }).notNull(),
  timeWindow: text("time_window").notNull().default(""),
  visitWelcome: boolean("visit_welcome").notNull().default(false),
  note: text("note").notNull().default(""),
});

export const signups = pgTable("signups", {
  id: serial("id").primaryKey(),
  planDayId: integer("plan_day_id")
    .notNull()
    .references(() => planDays.id, { onDelete: "cascade" }),
  helperName: text("helper_name").notNull(),
  dish: text("dish").notNull(),
  note: text("note").notNull().default(""),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Plan = typeof plans.$inferSelect;
export type PlanDay = typeof planDays.$inferSelect;
export type Signup = typeof signups.$inferSelect;
