import { User, UserType } from '@prisma/client'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { logger } from '@/lib/logger'
import { AuthOptions, User as NextAuthUser } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

export async function verifyCredentials(
  email: string, 
  password: string
): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user?.hashedPassword) {
      console.warn(`Authentication failed: No password set for user ${email}`)
      return null
    }

    const passwordValid = await bcrypt.compare(password, user.hashedPassword)
    if (!passwordValid) {
      console.warn(`Authentication failed: Invalid password for user ${email}`)
      return null
    }

    if (!user.email) {
      console.warn(`Authentication failed: Email is null for user ID ${user.id}`)
      return null
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      emailVerified: user.emailVerified,
      userType: user.userType || UserType.PROBLEM_SUBMITTER,
      hashedPassword: user.hashedPassword || '',
      image: user.image || null,
      username: user.username || null,
      bio: user.bio || null,
      industry: user.industry || null,
      role: user.role || null,
      expertise: user.expertise || [],
      skills: user.skills || [],
      interests: user.interests || [],
      goals: user.goals || [],
      allowCollaboration: user.allowCollaboration || true,
      profileVisibility: user.profileVisibility || 'public',
      notificationPrefs: user.notificationPrefs || null,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt || new Date(),
      linkedin: user.linkedin || null,
      github: user.github || null,
      twitter: user.twitter || null,
      accounts: [],
      sessions: [],
      problems: [],
      comments: [],
      sentRequests: [],
      receivedRequests: [],
      preferences: null,
      activities: []
    } as User
  } catch (error) {
    console.error('Authentication error:', error)
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

export const authOptions: AuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req): Promise<NextAuthUser | null> {
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email || undefined },
        });

        if (!user || !user.hashedPassword) return null;

        const passwordValid = await bcrypt.compare(credentials?.password || '', user.hashedPassword);
        if (!passwordValid) return null;

        // Explicitly cast to NextAuth's User type
        return {
          id: user.id,
          name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || undefined,
          email: user.email || undefined,
          image: user.image || undefined,
          emailVerified: user.emailVerified || undefined,
          userType: user.userType || undefined,
          role: user.role || undefined,
          firstName: user.firstName || undefined,
          lastName: user.lastName || undefined,
        } as NextAuthUser;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "github" || account?.provider === "google") {
        if (!user.email) return false;
        
        // Check if user exists
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          // Create new user if they don't exist
          await prisma.user.create({
            data: {
              email: user.email,
              firstName: user.name?.split(' ')[0] || '',
              lastName: user.name?.split(' ').slice(1).join(' ') || '',
              image: user.image,
              userType: UserType.PROBLEM_SUBMITTER,
              emailVerified: new Date(),
            },
          });
        }
      }
      return true;
    },
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};
