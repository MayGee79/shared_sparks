import NextAuth from "next-auth"
import { PrismaClient } from "@prisma/client"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/lib/prisma"
import { authOptions as baseAuthOptions } from "@/lib/auth"

// Define the shape of the user object expected by createUser
interface CreateUserInput {
  firstName?: string;
  lastName?: string;
  name?: string | null;
  email?: string;
  // add additional properties if needed
}

// Type the 'prisma' parameter explicitly with PrismaClient
const CustomPrismaAdapter = (prismaClient: PrismaClient) => {
  const defaultAdapter = PrismaAdapter(prismaClient)
  return {
    ...defaultAdapter,
    async createUser(user: CreateUserInput) {
      let { name, ...rest } = user
      if (name) {
        const [firstName, ...lastNameParts] = name.split(" ")
        const lastName = lastNameParts.join(" ") || ""
        user = { ...rest, firstName, lastName }
      }
      return defaultAdapter.createUser(user)
    },
  }
}

const authOptions = {
  ...baseAuthOptions,
  adapter: CustomPrismaAdapter(prisma),
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }