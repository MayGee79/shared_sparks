import { AuthOptions } from "next-auth";
import type { User, Session, Account } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

// Remove duplicate module augmentation from this file

async function refreshAccessToken(token: JWT) {
  try {
    const params = new URLSearchParams({
      client_id: process.env.AUTH0_CLIENT_ID ?? "",
      client_secret: process.env.AUTH0_CLIENT_SECRET ?? "",
      grant_type: "refresh_token",
      refresh_token: token.refreshToken?.toString() ?? "",
    });

    const url = `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token?${params.toString()}`;
    
    const response = await fetch(url, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      method: "POST",
    });

    const refreshedTokens = await response.json();

    if (!response.ok) throw refreshedTokens;

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (error) {
    console.log(error);
    return { ...token, error: "RefreshAccessTokenError" };
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (
          user &&
          user.hashedPassword &&
          bcrypt.compareSync(credentials.password, user.hashedPassword)
        ) {
          // Return only properties required by NextAuth
          const { id, email, firstName, lastName } = user;
          return { id, email, name: `${firstName} ${lastName}` } as User;
        }
        return null;
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/onboarding",
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET!,
  session: { strategy: "jwt" },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.includes("/onboarding")) return url;
      if (url === baseUrl) return `${baseUrl}/dashboard`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log("Session callback:", { session, token });
      if (session.user) session.user.id = token.sub!;
      session.accessToken = token.accessToken as string;
      return session;
    },
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
      console.log("JWT callback:", { token, user, account });
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at
          ? account.expires_at * 1000
          : Date.now() + 3600 * 1000;
        return token;
      }
      if (typeof token.accessTokenExpires === "number" && Date.now() > token.accessTokenExpires) {
        console.log("Access token expired; refreshing...");
        return refreshAccessToken(token);
      }
      return token;
    },
    // Simplified signIn callback:
    async signIn({ user, account }) {
      // If no user email, reject signIn.
      if (!user?.email) return false;
      // Otherwise simply return true.
      return true;
    },
  },
};