import NextAuth, { DefaultSession } from 'next-auth';
import "next-auth";

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      image?: string | null;
    } & DefaultSession['user'];
    accessToken?: string;
  }

  interface User {
    id: string;
    email: string;
    hashedPassword?: string;
    name?: string | null;
  }
}

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials || !credentials.email || !credentials.password) {
          return null;
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (user && user.hashedPassword && bcrypt.compareSync(credentials.password, user.hashedPassword)) {
          // Omit the hashedPassword property before returning
          const { hashedPassword, ...safeUser } = user;
          // Optionally cast to User so that it satisfies NextAuth:
          return safeUser as unknown as User;
        } else {
          return null;
        }
      },
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'openid email profile',
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
  ],
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/onboarding',
  },
  debug: true,
  secret: process.env.NEXTAUTH_SECRET!,  // use non-null assertion if you're sure it's provided
  session: { strategy: "jwt" },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.includes('/onboarding')) return url;
      if (url === baseUrl) return `${baseUrl}/dashboard`;
      if (url.startsWith(baseUrl)) return url;
      return baseUrl;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      console.log('Session callback:', { session, token });
      if (session.user) {
        session.user.id = token.sub!;
      }
      session.accessToken = token.accessToken as string;
      return session;
    },
    async jwt({ token, user, account }: { token: JWT; user?: User; account?: Account }) {
      console.log('JWT callback:', { token, user, account });
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = account.expires_at ? account.expires_at * 1000 : Date.now() + 3600 * 1000;
        return token;
      }
      if (typeof token.accessTokenExpires === 'number' && Date.now() > token.accessTokenExpires) {
        console.log('Access token has expired, refreshing...');
        return refreshAccessToken(token);
      }
      return token;
    },
    async signIn({ user, account }) {
      if (!user?.email) return false;
      const existingUser = await prisma.user.findUnique({
        where: { email: user.email }
      });
      if (existingUser && account?.type === 'oauth') {
        return '/auth/existing-user';
      }
      return true;
    }
  }
};