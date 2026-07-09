import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export type GuideStepRecord = { order: number; text: string };

export const guidesTable = pgTable("guides", {
  id: serial("id").primaryKey(),
  disasterType: text("disaster_type").notNull().unique(),
  title: text("title").notNull(),
  summary: text("summary").notNull(),
  beforeSteps: jsonb("before_steps").$type<GuideStepRecord[]>().notNull(),
  duringSteps: jsonb("during_steps").$type<GuideStepRecord[]>().notNull(),
  afterSteps: jsonb("after_steps").$type<GuideStepRecord[]>().notNull(),
});

export const insertGuideSchema = createInsertSchema(guidesTable).omit({ id: true });
export type InsertGuide = z.infer<typeof insertGuideSchema>;
export type Guide = typeof guidesTable.$inferSelect;
