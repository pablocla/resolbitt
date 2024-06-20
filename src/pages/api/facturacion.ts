import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const invoices = await prisma.invoice.findMany({
        include: {
          user: true,
          product: true,
        },
      });
      res.status(200).json(invoices);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      res.status(500).json({ error: "Error fetching invoices" });
    }
  } else if (req.method === "POST") {
    const { amount, userId, productId } = req.body;

    // Verificar datos recibidos
    if (!amount || !userId || !productId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const newInvoice = await prisma.invoice.create({
        data: {
          amount,
          userId,
          productId,
        },
      });
      res.status(201).json(newInvoice);
    } catch (error) {
      console.error("Error creating invoice:", error);
      res.status(500).json({ error: "Error creating invoice" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
