import { User } from 'next-auth'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { logger } from '@/lib/logger'

export async function verifyCredentials(
  email: string, 
  password: string
): Promise<User | null> {
  try {
    handleEmail(email)
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        hashedPassword: true,
        firstName: true,
        lastName: true
      }
    });

    if (!user?.hashedPassword) {
      logger.warn(`Authentication failed: No password set for user ${email}`)
      return null
    }

    const passwordValid = await bcrypt.compare(password, user.hashedPassword)
    if (!passwordValid) {
      logger.warn(`Authentication failed: Invalid password for user ${email}`)
      return null
    }

    return {
      id: user.id,
      email: user.email!, // non-null assertion if you're sure email is present
      name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim()
    }
  } catch (error) {
    logger.error('Authentication error:', { error, email })
    return null
  }
}

function handleEmail(email: string | null) {
  if (email === null) {
    // Handle the null case, e.g., return early or throw an error.
    throw new Error("Email is null");
  }
  
  // Now TypeScript knows email is a string.
  const safeEmail: string = email;
  console.log(safeEmail);
}