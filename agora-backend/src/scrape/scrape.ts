import puppeteer from "puppeteer";
import { db } from "../db/index.js";
import { NewsTable, type InsertNews } from "../db/schema.js";
import { generatePoliticOrientationWithLLM } from "../utils.js";

export async function scrapeElEspectador(url: string[]) {
  const allNoticias: InsertNews[] = [];

  for (const singleUrl of url) {
    console.log("🌐 Iniciando scraping en:", singleUrl);
    const browser = await puppeteer.launch({
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--single-process",
        "--disable-setuid-sandbox",
        "--disable-gpu",
        "--disable-dev-shm-usage",

        "--disable-site-isolation-trials",
        "--disable-blink-features=AutomationControlled",
      ],
    });

    const page = await browser.newPage();

    await page.goto(singleUrl, {
      waitUntil: "domcontentloaded",
    });

    const links = await page.evaluate(() => {
      const newsElements = document.querySelectorAll(".Card-Title > a");
      const results: string[] = [];
      newsElements.forEach((element) => {
        const href = element.getAttribute("href");
        if (href) {
          results.push(
            new URL(href, "https://www.elespectador.com").toString()
          );
        }
      });
      return results;
    });

    if (links.length === 0) {
      console.error("❌ No se encontraron enlaces de noticias.");
      await browser.close();
      continue;
    }

    const noticias: InsertNews[] = [];

    for (const link of links) {
      console.log("🔗 Visitando:", link);

      try {
        await page.goto(link, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });

        await page.waitForSelector(".ArticleHeader-Title", { timeout: 10000 });
        await page.waitForSelector(".ArticleHeader-Author > a", {
          timeout: 5000,
        });
        await page.waitForSelector(".ArticleHeader-Date", { timeout: 10000 });
        await page.waitForSelector(".ImageArticle-Image", { timeout: 10000 });
        await page.waitForSelector(".Article-Content p.font--secondary", {
          timeout: 10000,
        });
        const article = await page.evaluate(() => {
          const title =
            document
              .querySelector(".ArticleHeader-Title")
              ?.textContent?.trim() || null;

          const author =
            document
              .querySelector(".ArticleHeader-Author > a")
              ?.textContent?.trim() || null;
          const date =
            document
              .querySelector(".ArticleHeader-Date")
              ?.textContent?.trim() || null;
          const image =
            document
              .querySelector(".ImageArticle-Image")
              ?.getAttribute("srcset") || null;
          const content =
            Array.from(
              document.querySelectorAll(".Article-Content p.font--secondary")
            )
              .map((el) => el.textContent?.trim())
              .filter(Boolean)
              .join("\n") || null;

          return { title, author, date, image, content };
        });

        if (article && article.title) {
          noticias.push({
            body: article.content ? article.content : "No content",
            title: article.title ? article.title : "No title",
            url: link,
            imageUrl: article.image ? article.image : "No image",
            category: link.split("/")[1] ? link.split("/")[1] : "general",
            PoliticOrientation: await generatePoliticOrientationWithLLM(
              article.title,
              article.content
            ),
            sourceName: "El Espectador",
            publishedAt: article.date ? article.date : "",
          });
          console.log(
            "📰 Extraído:",
            article.title,
            article.date,
            article.image
          );
        }
      } catch (error) {
        console.error("⚠️ Error en", link, error);
      }
    }

    for (const news of noticias) {
      const existing = await db.query.NewsTable.findFirst({
        where: (newsDb, { eq }) =>
          eq(newsDb.url, news.url) || eq(newsDb.title, news.title),
      });

      if (existing) {
        console.log("📰 Noticia ya existe en la base de datos:", news.title);
        continue;
      }
      console.log("📰 Guardando en base de datos:", news.title);
      await db.insert(NewsTable).values({
        title: news.title,
        body: news.body,
        url: news.url,
        imageUrl: news.imageUrl,
        category: news.category,
        sourceName: news.sourceName,
        PoliticOrientation: news.PoliticOrientation,
        publishedAt: news.publishedAt,
      });
    }

    allNoticias.push(...noticias);
    await browser.close();
  }

  return allNoticias;
}
