import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from '@/lib/prisma'

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
    signOut: '/auth/signout'
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url === baseUrl) return `${baseUrl}/dashboard`
      if (url.startsWith(baseUrl)) return url
      return baseUrl
    },
    async session({ session, token }) {
      console.log('Session callback:', { session, token })
      if (session.user) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user, account }) {
      console.log('JWT callback:', { token, user, account })
      return token
    }
  }
} 