import { db } from "../db/index.js";

export const getAllUsers = async () => {
  try {
    const users = await db.query.UsersTable.findMany();
    if (!users) {
      throw new Error("No se encontraron usuarios");
    }
    return users;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    throw new Error("No se pudieron obtener los usuarios");
  }
};


