import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (req.method === "GET") {
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id: Number(id) },
        include: {
          customer: true,
          products: {
            include: {
              product: true,
            },
          },
        },
      });

      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }

      return res.status(200).json(invoice);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      return res.status(500).json({ error: "Error fetching invoice" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
