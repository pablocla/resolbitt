import { NextApiRequest, NextApiResponse } from "next";
import prisma, { testConnection } from "@/lib/db";
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verificar conexión a la base de datos
  const isConnected = await testConnection();
  if (!isConnected) {
    return res.status(500).json({
      error: "No se pudo establecer conexión con la base de datos"
    });
  }

  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({ 
        error: existingUser.email === email ? "Email already taken" : "Username already taken" 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: "USER",
        blocked: false
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        createdAt: true,
        blocked: true
      }
    });

    return res.status(201).json({ 
      message: "User created successfully",
      user: newUser 
    });

  } catch (error: any) {
    console.error("Error detallado:", error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        error: "El usuario o email ya existe"
      });
    }

    // Manejo específico de errores de autenticación
    if (error.message?.includes('Authentication failed') || 
        error.message?.includes('SCRAM failure')) {
      return res.status(500).json({
        error: "Error de autenticación con la base de datos",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }

    return res.status(500).json({
      error: "Error interno del servidor",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Error disconnecting from database:", disconnectError);
    }
  }
}
