import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from '../../../lib/prisma'
import bcrypt from 'bcryptjs'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (user && bcrypt.compareSync(credentials.password, user.hashedPassword)) {
          return user
        } else {
          return null
        }
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/onboarding',
  },
  callbacks: {
    async session({ session, token, user }: { session: any; token: any; user: any }) {
      session.user.id = token.id
      return session
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
})