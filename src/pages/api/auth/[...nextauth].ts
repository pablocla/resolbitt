import NextAuth from 'next-auth';
import type { NextAuthOptions, User as NextAuthUser, Session as NextAuthSession, Session } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import type { JWT } from 'next-auth/jwt';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

interface User extends NextAuthUser {
  role: string;
}

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & NextAuthSession['user'];
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error('Username y contraseña son requeridos');
        }

        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        if (!user) {
          throw new Error('Usuario no encontrado');
        }

        const isValid = await compare(credentials.password, user.password);

        if (!isValid) {
          throw new Error('Contraseña incorrecta');
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.username,
          role: user.role
        };
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60 // 24 horas
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as User).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id as string;
      }
      return session;
    }
  }
};

export default NextAuth(authOptions);
