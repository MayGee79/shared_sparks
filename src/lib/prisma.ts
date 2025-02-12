import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Extend the global object to include the prisma property
declare global {
  // Use let instead of var to avoid ESLint error
  // Add the prisma property to the global object
  let prisma: PrismaClient | undefined
}

// Use the global prisma instance if it exists, otherwise create a new one
const globalForPrisma = global as typeof globalThis & { prisma?: PrismaClient }
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma