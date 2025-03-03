import { User as PrismaUser } from '@prisma/client'

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email?: string | null
      image?: string | null
      firstName?: string | null
      lastName?: string | null
    }
  }

  interface User extends PrismaUser {}
}