import { DefaultSession } from 'next-auth'

export interface UserBase {
  id: string
  email: string
  name?: string | null
  hashedPassword?: string
}

declare module 'next-auth' {
  interface User extends UserBase {}
  interface Session {
    user: UserBase & DefaultSession['user']
  }
}