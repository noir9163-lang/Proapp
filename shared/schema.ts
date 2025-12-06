import { sql } from "drizzle-orm";
import { pgTable, text, varchar, boolean, time, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const alarms = pgTable("alarms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("userId").notNull(),
  label: text("label").notNull(),
  time: time("time").notNull(),
  enabled: boolean("enabled").notNull().default(true),
  sound: varchar("sound").notNull().default("bell"),
  repeatDays: text("repeatDays").default("[]"),
  snoozeUntil: timestamp("snoozeUntil"),
  lastTriggered: timestamp("lastTriggered"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAlarmSchema = createInsertSchema(alarms).pick({
  label: true,
  time: true,
  enabled: true,
  sound: true,
  repeatDays: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertAlarm = z.infer<typeof insertAlarmSchema>;
export type Alarm = typeof alarms.$inferSelect;
