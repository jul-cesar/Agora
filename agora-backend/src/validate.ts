import { zValidator } from '@hono/zod-validator';
import z from "zod";

const userSchema = z.object({
  email: z.email({ message: "El correo no es valido" }),
  name: z
    .string()
    .min(2, { message: "El nombre es muy corto" })
    .max(100, { message: "El nombre es muy largo" }),
  politicOrientation: z.enum(
    ["Izquierda", "Derecha", "Centro", "Centroderecha", "Centroizquierda"],
    { message: "Selecciona una opción válida" }
  ),
  nickname: z
    .string()
    .min(2, { message: "El nickname es muy corto" })
    .max(50, { message: "El nickname es muy largo" }),
  lastName: z
    .string()
    .min(2, { message: "El apellido es muy corto" })
    .max(50, { message: "El apellido es muy largo" }),
});

export const userValidator = zValidator("json", userSchema, (result, c) => {
  if (!result.success) {
    const errorMessages = result.error.issues.map(error => ({field: error.path[0], message: error.message}))
    return c.json({ messages: errorMessages }, 400)
  }
})