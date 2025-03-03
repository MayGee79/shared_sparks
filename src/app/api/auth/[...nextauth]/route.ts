import NextAuth, { User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
// To use Prisma adapter, uncomment the imports below and configure your prisma client accordingly
// import { PrismaAdapter } from '@next-auth/prisma-adapter'
// import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth/handlers'

// Define a custom user type that extends the NextAuth User type
interface CustomUser extends User {
  userType: string;
  role: string;
  firstName: string;
  lastName: string;
}

// Create and export the handler, not the options
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }