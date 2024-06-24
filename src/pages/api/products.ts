import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import * as yup from "yup";

const prisma = new PrismaClient();

const productSchema = yup.object().shape({
  name: yup.string().required(),
  price: yup.number().required().positive(),
  userId: yup.number().required().positive(),
  quantity: yup.number().required().positive().integer().min(1), // quantity debe ser mayor a 0
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
              stocks: true, // Incluir la relación de stock
            },
          })
        : await prisma.product.findMany({
            include: {
              user: true,
              stocks: true, // Incluir la relación de stock
            },
          });
      res.status(200).json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ error: "Error fetching products" });
    }
  } else if (req.method === "POST") {
    const { name, price, userId, quantity } = req.body;

    try {
      await productSchema.validate({ name, price, userId, quantity });
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        console.error("Validation Error:", validationError);
        return res.status(400).json({ error: validationError.errors[0] });
      }
      return res.status(400).json({ error: "Unknown validation error" });
    }

    try {
      const newProduct = await prisma.product.create({
        data: {
          name,
          price,
          userId,
          stocks: {
            create: { quantity }, // Crear el stock inicial
          },
        },
      });
      res.status(201).json(newProduct);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ error: "Error creating product" });
    }
  } else if (req.method === "PUT") {
    const { id, name, price, quantity } = req.body;

    try {
      await productSchema.validate({ name, price, userId: 1, quantity });
    } catch (validationError) {
      if (validationError instanceof yup.ValidationError) {
        return res.status(400).json({ error: validationError.errors[0] });
      }
      return res.status(400).json({ error: "Unknown validation error" });
    }

    try {
      // Primero, obtén el stock relacionado con el producto
      const stock = await prisma.stock.findFirst({
        where: { productId: id },
      });

      if (!stock) {
        return res.status(404).json({ error: "Stock not found" });
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: {
          name,
          price,
          stocks: {
            update: {
              where: { id: stock.id },
              data: { quantity },
            },
          },
        },
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
