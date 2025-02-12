import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

// Extend the global object to include the prisma property
declare global {
  // Use let instead of var to avoid ESLint error
  let prisma: PrismaClient | undefined
}

// Use the global prisma instance if it exists, otherwise create a new one
export const prisma = global.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma