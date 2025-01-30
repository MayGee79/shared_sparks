import { Session, AuthOptions } from "next-auth"
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from '@/lib/prisma'
import { JWT, DefaultJWT } from 'next-auth/jwt'
import { User } from 'next-auth'

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
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback:', { user, account, profile })
      return true
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      if (session.user) {
        session.user.id = token.sub
        session.user.role = 'user'
        session.user.membershipTier = 'free'
        session.user.joinedDate = new Date().toISOString()
        session.user.preferences = {
          notifications: true,
          theme: 'light'
        }
      }
      return session as Session
    },
    async jwt({ token, user }: { token: JWT & DefaultJWT, user: User | null }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.membershipTier = user.membershipTier
        token.joinedDate = user.joinedDate
      }
      return token
    }
  },
  session: {
    strategy: "jwt" as const,
  },
} 