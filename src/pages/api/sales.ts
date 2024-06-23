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

    // Grouping and summing the amounts by month
    const salesData = invoices.reduce(
      (acc, invoice) => {
        const month = new Date(invoice.createdAt).toLocaleString("default", {
          month: "long",
        });
        if (!acc.labels.includes(month)) {
          acc.labels.push(month);
          acc.data.push(0);
        }
        const monthIndex = acc.labels.indexOf(month);
        acc.data[monthIndex] += invoice.amount;
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
