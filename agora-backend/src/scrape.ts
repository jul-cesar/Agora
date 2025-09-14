import puppeteer from "puppeteer";
import { db } from "./db/conf.js";
import { NewsTable } from "./db/schema.js";

export async function scrapeElEspectador() {
  const browser = await puppeteer.launch({
    headless: false,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });

  const page = await browser.newPage();

  await page.goto("https://www.elespectador.com/politica", {
    waitUntil: "domcontentloaded",
  });

  const links = await page.evaluate(() => {
    const newsElements = document.querySelectorAll(".Card-Title > a");
    const results: string[] = [];
    newsElements.forEach((element) => {
      const href = element.getAttribute("href");
      if (href) {
        results.push(new URL(href, "https://www.elespectador.com").toString());
      }
    });
    return results;
  });

  if (links.length === 0) {
    console.error("❌ No se encontraron noticias en El Tiempo");
    await browser.close();
    return [];
  }

  const noticias: any[] = [];

  for (const link of links) {
    console.log("🔗 Visitando:", link);

    try {
      await page.goto(link, { waitUntil: "domcontentloaded", timeout: 20000 });

      await page.waitForSelector(".ArticleHeader-Title", { timeout: 10000 });

      const article = await page.evaluate(() => {
        const title =
          document.querySelector(".ArticleHeader-Title")?.textContent?.trim() ||
          null;
        const author =
          document
            .querySelector(".ArticleHeader-Author > a")
            ?.textContent?.trim() || null;
        const date =
          document.querySelector(".ArticleHeader-Date")?.textContent?.trim() ||
          null;
        const content =
          Array.from(
            document.querySelectorAll(".Article-Content p.font--secondary")
          )
            .map((el) => el.textContent?.trim())
            .filter(Boolean)
            .join("\n") || null;

        return { title, author, date, content };
      });

      if (article && article.title) {
        noticias.push({ url: link, ...article });
        console.log("📰 Extraído:", article.content);
      }
    } catch (error) {
      console.error("⚠️ Error en", link, error);
    }
  }

  for (const news of noticias) {
    await db.insert(NewsTable).values({
      title: news.title || "No title",
      body: news.content || "No content",
      url: news.url,
      imageUrl: "",
      category: "politics",
      sourceName: "El Espectador",
      PoliticOrientation: "left",
      publishedAt: news.date || new Date().toISOString(),
    });
  }

  await browser.close();
  return noticias;
}

scrapeElEspectador().then((result) => {
  console.log("\n📊 Total:", result.length, "noticias extraídas");
});
