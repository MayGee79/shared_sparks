import { AuthOptions } from "next-auth";
import type { User, Session, Account } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { JWT } from "next-auth/jwt";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { UserType } from "@prisma/client";
import { logger } from './logger'

// Helper function to create consistent user profile
function createUserProfile(id: string,
  email: string | null,
  name: string | null,
  image: string | null) {
  return ({
    id,
    email,
    firstName: name?.split(' ')[0] || null,
    lastName: name?.split(' ').slice(1).join(' ') || null,
    image,
    emailVerified: null,
    userType: UserType.PROBLEM_SUBMITTER,
    allowCollaboration: true,
    profileVisibility: 'PUBLIC',
    notificationPrefs: {},
    createdAt: new Date(),
    updatedAt: new Date(),
    username: null,
    bio: null,
    industry: null,
    role: null,
    expertise: [],
    skills: [],
    interests: [],
    goals: []
  });
}

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
      profile(profile, tokens) {
        return {
          ...createUserProfile(
            profile.id.toString(),
            profile.email || `${profile.login}@github.com`,
            profile.name || profile.login,
            profile.avatar_url
          ),
          username: profile.login,
          hashedPassword: null,
          role: '',
          linkedin: null,
          github: profile.html_url || null,
          twitter: null,
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      profile(profile: any, tokens: any) {
        return {
          ...createUserProfile(
            profile.sub,
            profile.email,
            profile.name || profile.email,
            profile.picture || null
          ),
          username: profile.email.split('@')[0],
          bio: profile.description || null,
          hashedPassword: null,
          role: '',
          linkedin: null,
          github: null,
          twitter: null,
        };
      },
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
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET!,
  session: { strategy: "jwt" },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.includes("/onboarding")) return url;
      if (url === baseUrl) return `${baseUrl}/dashboard`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    async session({ session, token, user }: { session: Session; token: JWT; user?: User }) {
      console.log("Session callback:", { session, token });
      if (session.user) {
        session.user.id = token.sub!;
        // Ensure userType is properly typed
        session.user.userType = user?.userType as UserType ?? "PROBLEM_SUBMITTER" as UserType;
        
        // Add needsOnboarding as a type assertion since it's not in the type
        (session.user as any).needsOnboarding = !user?.firstName || !user?.lastName;
      }
      // Add accessToken to the session type or use a type assertion
      (session as any).accessToken = token.accessToken as string;
      return session;
    },
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account | null }) {
      logger.info('JWT callback:', { token, user, account })
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