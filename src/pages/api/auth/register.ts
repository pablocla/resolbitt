import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

interface PrismaError extends Error {
  code?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ error: "Username, email and password are required" });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: "Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).json({ message: "User created", user: newUser });
  } catch (error) {
    const prismaError = error as PrismaError;
    if (prismaError.code === "P2002") {
      // Código de error de violación de unicidad en Prisma
      return res.status(409).json({ error: "Email already taken" });
    } else if (prismaError instanceof Error) {
      // Manejar otros errores
      return res.status(500).json({ error: "Internal server error" });
    } else {
      return res.status(500).json({ error: "Unknown error" });
    }
  }
}
