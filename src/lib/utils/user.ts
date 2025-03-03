import type { User } from '@prisma/client'
import type { SafeUser } from '@/types'  // Updated import path

export function sanitizeUser(user: User): SafeUser {
  const { hashedPassword, ...safeUser } = user
  return safeUser
}