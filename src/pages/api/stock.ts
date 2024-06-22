import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const stocks = await prisma.stock.findMany({
        include: {
          product: true,
        },
      });
      res.status(200).json(stocks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching stocks" });
    }
  } else if (req.method === "POST") {
    const { name, description, price, userId, quantity } = req.body;
    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          description,
          price,
          userId,
          stocks: {
            create: {
              quantity,
            },
          },
        },
      });
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ error: "Error creating product" });
    }
  } else if (req.method === "PATCH") {
    const { id, adjustment } = req.body;
    try {
      const stock = await prisma.stock.update({
        where: { id },
        data: { quantity: { increment: adjustment } },
      });
      res.status(200).json(stock);
    } catch (error) {
      res.status(500).json({ error: "Error adjusting stock quantity" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
