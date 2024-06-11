import { PrismaClient } from "@prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Extender globalThis para incluir prisma
interface CustomNodeJsGlobal extends NodeJS.Global {
  prisma?: PrismaClient;
}

declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || prismaClientSingleton();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
