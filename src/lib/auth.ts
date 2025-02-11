import { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from '@/lib/prisma';

async function refreshAccessToken(token: JWT) {
  try {
    const params = new URLSearchParams({
      client_id: process.env.AUTH0_CLIENT_ID ?? '',
      client_secret: process.env.AUTH0_CLIENT_SECRET ?? '',
      grant_type: 'refresh_token',
      refresh_token: token.refreshToken?.toString() ?? '',
    });

    const url = `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token?${params.toString()}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);

    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    signOut: '/auth/signout',
    newUser: '/auth/register'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Check if this is a new user registration
      if (url.includes('/onboarding')) return url;
      if (url === baseUrl) return `${baseUrl}/dashboard`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token });
      if (session.user) {
        session.user.id = token.sub;
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback:', { token, user, account });
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000;
        return token;
      }

      // If the access token has expired, try to update it
      if (typeof token.accessTokenExpires === 'number' && Date.now() > token.accessTokenExpires) {
        console.log('Access token has expired, refreshing...');
        return refreshAccessToken(token);
      }

      return token;
    },
    async signIn({ user, account }) {
      if (!user?.email) return false;
      
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });
      
      if (existingUser && account?.type === 'oauth') {
        return '/auth/existing-user';
      }
      
      return true;
    }
  }
};