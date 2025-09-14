import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const NewsTable = sqliteTable("news", {
  id: int().primaryKey({ autoIncrement: true }),
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

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  politicOrientation: text().notNull(),
  email: text().notNull().unique(),
});


