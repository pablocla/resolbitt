import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { search } = req.query;

    try {
      const customers = search
        ? await prisma.customer.findMany({
            where: {
              name: {
                contains: search as string,
                mode: "insensitive",
              },
            },
          })
        : await prisma.customer.findMany();

      res.status(200).json(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      res.status(500).json({ error: "Error fetching customers" });
    }
  } else if (req.method === "POST") {
    const { name, email, phone, cuit } = req.body;

    if (!name || !cuit) {
      res.status(400).json({ error: "Name and CUIT are required" });
      return;
    }

    try {
      const newCustomer = await prisma.customer.create({
        data: {
          name,
          email,
          phone,
          cuit,
        },
      });
      res.status(201).json(newCustomer);
    } catch (error) {
      console.error("Error creating customer:", error);
      res.status(500).json({ error: "Error creating customer" });
    }
  } else if (req.method === "PUT") {
    const { id, name, email, phone, cuit } = req.body;

    if (!id || !name || !cuit) {
      res.status(400).json({ error: "ID, Name and CUIT are required" });
      return;
    }

    try {
      const updatedCustomer = await prisma.customer.update({
        where: { id },
        data: {
          name,
          email,
          phone,
          cuit,
        },
      });
      res.status(200).json(updatedCustomer);
    } catch (error) {
      console.error("Error updating customer:", error);
      res.status(500).json({ error: "Error updating customer" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
