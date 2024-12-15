import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@prisma/client';
import type { JWT } from 'next-auth/jwt';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

// Definir interfaz extendida para User
interface CustomUser {
  id: string;
  email: string | null;
  name: string | null;
  role: string;
  username?: string;
}

// Extender tipos de next-auth
declare module 'next-auth' {
  interface User extends CustomUser {}
  
  interface Session {
    user: {
      id: string;
      email: string | null;
      name: string | null;
      role: string;
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends Pick<CustomUser, 'id' | 'role'> {}
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
    signIn: '/auth/',
    error: '/auth/error'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          role: user.role
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role
        }
      };
    }
  }
};

export default NextAuth(authOptions);
