import { serve } from "@hono/node-server";
import { desc, eq } from "drizzle-orm";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { db } from "./db/index.js";
import { NewsTable, UsersTable, type InsertUser } from "./db/schema.js";
import "./scheduler.js";
import { userValidator } from "./validate.js";
const app = new Hono().basePath("/api/agora");

app.use("*", cors({
  origin: "*"
}));

app.get("/", (c) => {
  return c.json({ message: "API de Agora funcionando" });
});

const scheduleTime = process.env.NEWS_DISPATCH_TIME 

app.post("/users", userValidator, async (c) => {
  try {
    const data = await c.req.json<InsertUser>();
    console.log(data);
    const users = await db.select().from(UsersTable).where(eq(UsersTable.email, data.email)).limit(1);
    const user = users[0];
    if (user) {
      return c.json({ message: "El usuario ya existe" }, { status: 409 });
    }
    const ins = await db.insert(UsersTable).values(data);
    if(!ins) {
      return c.json({ message: "Error al registrar el usuario" }, { status: 500 });
    }
    return c.json({ message: "Usuario recibido", data });
  } catch (e) {
    console.log(e);
    return c.json({ message: "Error al registrar el usuario" });
  }
});


app.get("/news", async (c) => {
  try {
    const news = await db.select().from(NewsTable).orderBy(desc(NewsTable.publishedAt)).limit(20);
    if (!news || news.length === 0) {
      return c.json({ message: "No hay noticias" }, { status: 404 });
    }
    return c.json({ news });
  } catch (e) {
    console.log(e);
    return c.json({ message: "Error al obtener las noticias" }, { status: 500 });
  }
  
});



serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}. Scrape y envio de noticias a las ${scheduleTime}`);
  }
);
