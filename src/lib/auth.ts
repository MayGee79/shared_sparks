import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.hashedPassword) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.hashedPassword
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.firstName ? `${user.firstName} ${user.lastName || ''}` : undefined,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
}; 