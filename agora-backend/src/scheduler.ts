import cron from "node-cron";
import { scrapeElEspectador } from "./scrape/scrape.js";
import { getLatestNews } from "./services/news-services.js";
import { getAllUsers } from "./services/usuarios-service.js";
import { sendEmail } from "./utils.js";

const rawCronTime = process.env.NEWS_DISPATCH_TIME;

if (!rawCronTime) {
  console.error("ERROR: NEWS_DISPATCH_TIME environment variable is not set!");
  process.exit(1);
}

const [hour, minute] = rawCronTime.split(":");

if (
  hour === undefined ||
  minute === undefined ||
  isNaN(parseInt(hour)) ||
  isNaN(parseInt(minute))
) {
  console.error(
    `ERROR: Invalid NEWS_DISPATCH_TIME format: ${rawCronTime}. Expected HH:mm.`
  );
  process.exit(1);
}

cron.schedule(
  `${minute} ${hour} * * *`,
  async () => {
    console.log("⏰ Ejecutando envío de boletines...");

    console.log("⏳ Iniciando scrapeo de noticias...");

    await scrapeElEspectador([
      "https://www.elespectador.com/politica",

      "https://www.elespectador.com/colombia/mas-regiones",
      "https://www.elespectador.com/economia",
      "https://www.elespectador.com/mundo",
      "https://www.elespectador.com/opinion",
      "https://www.elespectador.com/judicia",
    ]);

    console.log("✅ Scrapeo de noticias completado.");

    const noticias = await getLatestNews();

    if (noticias.length === 0) {
      console.log(
        `❌ No hay noticias para ${new Date().toLocaleDateString()} enviar`
      );
      return;
    }

    console.log(`✅ Enviando boletines para ${noticias.length} noticias...`);

    const usuarios = await getAllUsers();

    if (usuarios.length === 0) {
      console.log(`❌ No hay usuarios registrados a quien enviar enviar`);
      return;
    }

    console.log(`✅ Enviando boletines a ${usuarios.length} usuarios...`);

    for (const user of usuarios) {
      const noticiasFiltradas = noticias.filter((n) => {
        if (user.politicOrientation === "Izquierda")
          return n.PoliticOrientation === "Izquierda";
        if (user.politicOrientation === "Derecha")
          return n.PoliticOrientation === "Derecha";
        if (user.politicOrientation === "Centro")
          return n.PoliticOrientation === "Centro";
        if (user.politicOrientation === "Centroizquierda")
          return ["Izquierda", "Centro"].includes(n.PoliticOrientation);
        if (user.politicOrientation === "Centroderecha")
          return ["Derecha", "Centro"].includes(n.PoliticOrientation);
        return false;
      });

      await sendEmail(
        user.email,
        `Hola ${
          user.name
        }, aquí tienes el boletín de hoy ${new Date().toLocaleDateString()}:`,
        noticiasFiltradas
      );
      console.log(`📨 Enviado boletín a ${user.email}`);
    }

    console.log("✅ Boletines enviados");
  },
  {
    timezone: "America/Bogota",
  }
);
