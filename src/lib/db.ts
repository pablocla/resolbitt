import { PrismaClient, Prisma } from '@prisma/client';

const DATABASE_URL = "mongodb+srv://pabloclavero77:fLUr3tZ9otB4vtdD@cluster0.lw40c.mongodb.net/cluster0?authSource=admin&retryWrites=true&w=majority";

const prismaClientOptions = {
  log: ['query', 'error', 'warn'] as Array<Prisma.LogLevel>,
  errorFormat: 'pretty' as const,
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
};

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient(prismaClientOptions);
} else {
  const globalWithPrisma = global as typeof globalThis & { prisma?: PrismaClient };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient(prismaClientOptions);
  }
  prisma = globalWithPrisma.prisma;
}

export async function testConnection() {
  try {
    // Intenta una operación simple en lugar de usar $runCommandRaw
    await prisma.user.findFirst();
    console.log("Conexión exitosa a MongoDB!");
    return true;
  } catch (error) {
    console.error('Error de conexión a la base de datos:', error);
    return false;
  }
}

export default prisma;
