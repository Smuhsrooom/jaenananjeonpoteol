import { pgTable, text, serial, integer, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const sheltersTable = pgTable("shelters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  shelterType: text("shelter_type").notNull(),
  address: text("address").notNull(),
  region: text("region").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  capacity: integer("capacity").notNull(),
  phone: text("phone").notNull(),
  notes: text("notes"),
});

export const insertShelterSchema = createInsertSchema(sheltersTable).omit({ id: true });
export type InsertShelter = z.infer<typeof insertShelterSchema>;
export type Shelter = typeof sheltersTable.$inferSelect;
