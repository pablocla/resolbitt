import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as yup from "yup";

const prisma = new PrismaClient();

const productSchema = yup.object().shape({
  name: yup.string().required(),
  price: yup.number().required().positive(),
  userId: yup.number().required().positive(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { search } = req.query;
    try {
      const products = search
        ? await prisma.product.findMany({
            where: {
              name: {
                contains: search as string,
                mode: "insensitive",
              },
            },
            include: {
              user: true,
            },
          })
        : await prisma.product.findMany({
            include: {
              user: true,
            },
          });
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Error fetching products" });
    }
  } else if (req.method === "POST") {
    const { name, price, userId } = req.body;

    try {
      await productSchema.validate({ name, price, userId });
    } catch (validationError) {
      console.error("Validation Error:", validationError);
      return res.status(400).json({ error: "Invalid input data" });
    }

    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          price,
          userId,
        },
      });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Error creating product" });
    }
  } else if (req.method === "PUT") {
    const { id, name, price } = req.body;

    try {
      await productSchema.validate({ name, price, userId: 1 });
    } catch (validationError) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    try {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: { name, price },
      });
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ error: "Error updating product" });
    }
  } else if (req.method === "DELETE") {
    const { id } = req.body;

    try {
      await prisma.product.delete({
        where: { id },
      });
      res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Error deleting product" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
