import { createId } from "@paralleldrive/cuid2";
import { sql } from "drizzle-orm";
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const NewsTable = pgTable("news", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  body: text("body").notNull(),
  url: text("url").notNull(),
  imageUrl: text("imageUrl").notNull(),
  publishedAt: text("publishedAt").notNull(),
  sourceName: text("sourceName").notNull(),
  category: text("category").notNull(),
  PoliticOrientation: text("PoliticOrientation").notNull(),
  createdAt: timestamp().notNull().default(sql`now()`),

});

export type InsertNews = typeof NewsTable.$inferInsert;
export type News = typeof NewsTable.$inferSelect;

export const UsersTable = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  name: text("name").notNull(),
  lastName: text("lastName").notNull(),
  nickname: text("nickname").notNull(),
  politicOrientation: text("politicOrientation")
    .notNull()
    .$type<
      "Izquierda" | "Derecha" | "Centro" | "Centroizquierda" | "Centroderecha"
    >(),
  email: text("email").notNull().unique(),
});

export type InsertUser = typeof UsersTable.$inferInsert;
