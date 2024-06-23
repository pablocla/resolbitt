import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getSalesData = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // Fetching invoices data from the database
    const invoices = await prisma.invoice.findMany({
      select: {
        amount: true,
        createdAt: true,
      },
    });

    // Grouping and summing the amounts by day
    const salesData = invoices.reduce(
      (acc, invoice) => {
        const day = new Date(invoice.createdAt).toLocaleDateString("default", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        if (!acc.labels.includes(day)) {
          acc.labels.push(day);
          acc.data.push(0);
        }
        const dayIndex = acc.labels.indexOf(day);
        acc.data[dayIndex] += invoice.amount;
        return acc;
      },
      { labels: [], data: [] } as { labels: string[]; data: number[] }
    );

    res.status(200).json(salesData);
  } catch (error) {
    console.error("Error fetching sales data:", error);
    res.status(500).json({ error: "Error fetching sales data" });
  }
};

export default getSalesData;
