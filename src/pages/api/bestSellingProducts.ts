import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getBestSellingProducts = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Fetching product sales data from the database
    const products = await prisma.product.findMany({
      include: {
        _count: {
          select: {
            invoices: true,
          },
        },
      },
      orderBy: {
        invoices: {
          _count: "desc",
        },
      },
      take: 10, // Limiting to top 10 products
    });

    const productData = products.map((product) => ({
      name: product.name,
      count: product._count.invoices,
    }));

    res.status(200).json(productData);
  } catch (error) {
    console.error("Error fetching product data:", error);
    res.status(500).json({ error: "Error fetching product data" });
  }
};

export default getBestSellingProducts;
