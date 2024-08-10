import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case "GET": {
      // Obtener un usuario por ID
      try {
        const user = await prisma.user.findUnique({
          where: { id: Number(id) },
        });
        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
      break;
    }

    case "PUT": {
      // Actualizar un usuario por ID
      const { username, email, role, blocked } = req.body;
      try {
        const updatedUser = await prisma.user.update({
          where: { id: Number(id) },
          data: { username, email, role, blocked },
        });
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
      break;
    }

    case "DELETE": {
      // Eliminar un usuario por ID
      try {
        await prisma.user.delete({ where: { id: Number(id) } });
        res.status(200).json({ message: "User deleted successfully" });
      } catch (error) {
        res.status(500).json({ error: "Internal server error" });
      }
      break;
    }

    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
