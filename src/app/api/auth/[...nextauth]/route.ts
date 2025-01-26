import NextAuth from 'next-auth'
import { PrismaClient } from '@prisma/client/edge'
import { PrismaAdapter } from '@auth/prisma-adapter'

const prisma = new PrismaClient()
const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [],
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
