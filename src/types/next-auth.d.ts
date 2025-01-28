import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id?: string
      name?: string
      email?: string
      image?: string
      role?: string
      membershipTier?: string
      joinedDate?: string
      preferences?: {
        notifications: boolean
        theme: string
      }
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    membershipTier?: string
    joinedDate?: string
    preferences?: {
      notifications: boolean
      theme: string
    }
  }
}
