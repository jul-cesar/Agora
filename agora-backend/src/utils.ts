import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.OPENAI_API_KEY!,
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
