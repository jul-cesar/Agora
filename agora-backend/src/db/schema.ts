import { createId } from "@paralleldrive/cuid2";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";



export const NewsTable = sqliteTable("news", {
  id: text().primaryKey().$defaultFn(() => createId()),
  title: text().notNull(),
  body: text().notNull(),
  url: text().notNull(),
  imageUrl: text().notNull(),
  publishedAt: text().notNull(),
  sourceName: text().notNull(),
  category: text().notNull(),
  PoliticOrientation: text().notNull(),
  createdAt: text().notNull().default(new Date().toISOString()),
});

export type InsertNews = typeof NewsTable.$inferInsert;
export type News = typeof NewsTable.$inferSelect;

export const usersTable = sqliteTable("users", {
  id: text().primaryKey().$defaultFn(() => createId() ),
  name: text().notNull(),
  lastName: text().notNull(),
  nickname: text().notNull(),
  politicOrientation: text().notNull().$type<"Izquierda" | "Derecha" | "Centro" | "Centroizquierda" | "Centroderecha">(),
  email: text().notNull().unique(),
});

export type InsertUser = typeof usersTable.$inferInsert;


