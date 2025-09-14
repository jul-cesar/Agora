# 🏛️ Ágora

**Ágora** es una plataforma web que recolecta diariamente noticias de fuentes públicas y gratuitas, las clasifica automáticamente según su orientación política (**Izquierda, Centro o Derecha**) utilizando scraping, procesamiento de lenguaje natural e inteligencia artificial, y las distribuye a los usuarios de acuerdo con su afinidad ideológica.

Inspirado en la **plaza pública de la antigua Grecia**, Ágora busca ser un espacio digital donde cada persona pueda acceder a la información desde diferentes perspectivas, fomentando la pluralidad y el pensamiento crítico.

---

## ✨ Características

- 🔎 **Scraping con Crawl4ai**: obtiene noticias de sitios públicos y gratuitos.  
- 🧠 **Clasificación política**: usa reglas y/o modelos de IA (OpenAI API u otros).  
- 👤 **Gestión de usuarios**: registro con nombre, alias, correo y afinidad política.  
- 📬 **Envío de correos**: boletines personalizados con **Resend**.  
- ⏰ **Tareas programadas**: ejecución automática con `node-cron`.  
- 🖥️ **Despliegue On Premise**: en servidor físico, VM o contenedor Docker.  

---

## 🛠️ Tecnologías

- [Hono.js](https://hono.dev/) → Framework ultraligero para APIs en Node.js.  
- [Crawl4ai](https://docs.crawl4ai.com/core/simple-crawling/) → Scraping
- [Resend](https://resend.com/) → Envío de correos transaccionales.  
- [OpenAI API](https://platform.openai.com/) (opcional) → Clasificación avanzada de noticias.  
- [node-cron](https://www.npmjs.com/package/node-cron) → Programación de tareas.  
- [PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io/) → Persistencia de datos.  

---

## 🚀 Instalación y uso

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone https://github.com/tuusuario/agora.git
cd agora
```

Instala las dependencias con **pnpm**:

```bash
pnpm install
```

Crea un archivo `.env` en la raíz del proyecto con tus credenciales:

```env
# Base de datos
DATABASE_URL="postgresql://user:password@localhost:5432/agora"

# API Keys
OPENAI_API_KEY=tu_api_key_openai
RESEND_API_KEY=tu_api_key_resend

# Configuración de envío
SEND_HOUR=8   # Hora en la que se envían los correos (ej: 8 = 8 AM)
```

Ejecuta el servidor en modo desarrollo:

```bash
pnpm run dev
```

La API estará disponible en:  
👉 `http://localhost:3000`

---

## 📡 Endpoints principales

- `POST /usuarios` → Registro de usuario.  
- `GET /noticias` → Obtiene noticias clasificadas.  
- `POST /enviar` → Envía boletín de noticias a los usuarios (según afinidad).
