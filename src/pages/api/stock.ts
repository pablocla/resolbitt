import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const products = await prisma.product.findMany();
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Error fetching products" });
    }
  } else if (req.method === "POST") {
    const { name, deposit, userId } = req.body;
    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          deposit,
          userId, // Asegúrate de que userId sea proporcionado en la solicitud
        },
      });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: "Error creating product" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
