import { GoogleGenAI } from "@google/genai";
import { Resend } from "resend";
import type { News } from "./db/schema.js";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY!,
});

export const generatePoliticOrientationWithLLM = async (
  title: string | null,
  body: string | null
) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
Eres un analista político especializado en Colombia. 
Tu tarea es clasificar la orientación ideológica de una noticia en una de estas categorías únicas:

- Izquierda  
- Derecha  
- Centro  

Reglas:
- Responde únicamente con **una sola palabra exacta**: "Izquierda", "Derecha" o "Centro".  
- No expliques tu razonamiento.  
- Si no eres capaz de determinar la orientación con certeza, responde una que mas creas, pero siempre indica una.
- No uses sinónimos.  
- Si el texto es ambiguo o no relevante a política, asúmelo como "Centro".  

Ahora clasifica esta noticia:

Título: ${title}
Contenido: ${body}
`,
  });
  console.log("LLM response:", response.text);

  return response.text?.trim() || "";
};

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async (to: string, subject: string, news: News[]) => {
  const currentDate = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; line-height: 1.6;">
      
      <!-- Header -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
        <tr>
          <td style="padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              📰 Agora News
            </h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">
              ${currentDate}
            </p>
          </td>
        </tr>
      </table>

      <!-- Main Content -->
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: white;">
        <tr>
          <td style="padding: 30px 20px;">
            
            <!-- Welcome Message -->
            <div style="text-align: center; margin-bottom: 40px;">
              <h2 style="color: #1e293b; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">
                Las noticias más relevantes del día
              </h2>
              <p style="color: #64748b; margin: 0; font-size: 16px;">
                Mantente informado con nuestra selección de noticias
              </p>
            </div>

            <!-- News Items -->
            ${news
              .map(
                (item, index) => `
              <div style="margin-bottom: 30px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); transition: transform 0.2s;">
                
                <!-- News Image -->
                ${
                  item.imageUrl
                    ? `
                  <div style="width: 100%; height: 200px; overflow: hidden;">
                    <img src="${item.imageUrl}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover; display: block;">
                  </div>
                `
                    : ""
                }
                
                <!-- News Content -->
                <div style="padding: 20px;">
                  
                  <!-- Category & Source -->
                  <div style="margin-bottom: 12px;">
                    <span style="background-color: #3b82f6; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${item.category}
                    </span>
                    <span style="color: #64748b; font-size: 14px; margin-left: 10px;">
                      ${item.sourceName}
                    </span>
                  </div>

                  <!-- Title -->
                  <h3 style="margin: 0 0 12px 0; font-size: 20px; font-weight: 600; color: #1e293b; line-height: 1.3;">
                    <a href="${
                      item.url
                    }" style="color: #1e293b; text-decoration: none;" target="_blank">
                      ${item.title}
                    </a>
                  </h3>

                  <!-- Body Preview -->
                  <p style="color: #475569; margin: 0 0 15px 0; font-size: 15px; line-height: 1.5;">
                    ${
                      item.body.length > 150
                        ? item.body.substring(0, 150) + "..."
                        : item.body
                    }
                  </p>

                  <!-- Footer with Date and Read More -->
                  <div style="display: flex; flex-direction: column; gap: 10px; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 15px; margin-top: 15px;">
                    <span style="color: #94a3b8; font-size: 13px;">
                      ${item.publishedAt || new Date().toISOString()}
                    </span>
                    <a href="${
                      item.url
                    }" target="_blank" style="background-color: #3b82f6; color: white; padding: 8px 16px; border-radius: 6px; text-decoration: none; font-size: 14px; font-weight: 500; transition: background-color 0.2s;">
                      Leer más →
                    </a>
                  </div>

                  <!-- Political Orientation Indicator -->
                  ${
                    item.PoliticOrientation &&
                    item.PoliticOrientation !== "neutral"
                      ? `
                    <div style="margin-top: 10px;">
                      <span style="color: #64748b; font-size: 12px;">
                        Orientación: <span style="font-weight: 500;">${item.PoliticOrientation}</span>
                      </span>
                    </div>
                  `
                      : ""
                  }
                </div>
              </div>
            `
              )
              .join("")}

          </td>
        </tr>
      </table>

      <!-- Footer -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #1e293b; max-width: 600px; margin: 0 auto;">
        <tr>
          <td style="padding: 30px 20px; text-align: center;">
            <p style="color: #94a3b8; margin: 0 0 15px 0; font-size: 14px;">
              Gracias por leer Agora News
            </p>
            <div style="margin-bottom: 20px;">
              <a href="#" style="color: #3b82f6; text-decoration: none; margin: 0 10px; font-size: 14px;">Visitar sitio web</a>
              <span style="color: #64748b;">|</span>
              <a href="#" style="color: #3b82f6; text-decoration: none; margin: 0 10px; font-size: 14px;">Configurar preferencias</a>
              <span style="color: #64748b;">|</span>
              <a href="#" style="color: #3b82f6; text-decoration: none; margin: 0 10px; font-size: 14px;">Darse de baja</a>
            </div>
            <p style="color: #64748b; margin: 0; font-size: 12px;">
              © 2024 Agora News. Todos los derechos reservados.
            </p>
          </td>
        </tr>
      </table>

    </body>
    </html>
  `;

  const response = await resend.emails.send({
    from: "news@agoranews.fun",
    to,
    subject,
    html: htmlTemplate,
  });

  return response;
};
