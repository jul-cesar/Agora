import { and } from "drizzle-orm";
import { db } from "../db/index.js";

export const getLatestNews = async () => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    const news = await db.query.NewsTable.findMany({
      where: (news, { gte, lt }) =>
        and(
          gte(news.createdAt, startOfDay),
          lt(news.createdAt, endOfDay)
        ),
    });

    if (!news || news.length === 0) {
      throw new Error("No se encontraron noticias de hoy");
    }

    return news;
  } catch (error) {
    console.error("Error al obtener noticias:", error);
    throw new Error("No se pudieron obtener las noticias");
  }
};