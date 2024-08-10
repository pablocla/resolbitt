import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/db";
import bcrypt from "bcrypt";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.password || !credentials?.username) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.username },
        });

        if (user && bcrypt.compareSync(credentials.password, user.password)) {
          return {
            id: String(user.id), // Convertir id a cadena
            username: user.username,
            email: user.email,
            password: user.password,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
