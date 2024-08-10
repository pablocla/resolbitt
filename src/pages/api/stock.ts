// src/pages/api/stock.ts
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
      console.error("Error fetching stock:", error);
      res.status(500).json({ error: "Error fetching stock" });
    }
  } else if (req.method === "POST") {
    const { productId, quantity } = req.body;

    try {
      const newStock = await prisma.stock.create({
        data: {
          productId,
          quantity,
        },
      });
      res.status(201).json(newStock);
    } catch (error) {
      console.error("Error creating stock:", error);
      res.status(500).json({ error: "Error creating stock" });
    }
  } else if (req.method === "PATCH") {
    const { id, adjustment } = req.body;

    try {
      const stock = await prisma.stock.update({
        where: { id },
        data: { quantity: { increment: adjustment } },
        include: { product: true },
      });
      res.status(200).json(stock);
    } catch (error) {
      console.error("Error adjusting stock:", error);
      res.status(500).json({ error: "Error adjusting stock" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PATCH"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
