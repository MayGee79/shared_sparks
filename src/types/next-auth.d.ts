import "next-auth"
import NextAuth from "next-auth"
import { User } from "@prisma/client";
import { DefaultSession } from "next-auth";

// Define SafeUser first before using it
export type SafeUser = Omit<
  User,
  "hashedPassword" | "createdAt" | "updatedAt" | "emailVerified"
>;

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: SafeUser & DefaultSession["user"];
    accessToken?: string;
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    emailVerified?: Date | null
    userType?: string
    role?: string
    firstName?: string | null
    lastName?: string | null
    username?: string | null
    bio?: string | null
    linkedin?: string | null
    github?: string | null
    twitter?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    userType?: string
    role?: string
    firstName?: string
    lastName?: string
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
  }
}