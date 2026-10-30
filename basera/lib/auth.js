import GithubProvider from 'next-auth/providers/github';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import User from '@/models/User';
import { checkAuthBackoff, recordFailedAuth, resetFailedAuth } from './rateLimit';

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        // Apply backoff check
        const backoff = checkAuthBackoff(credentials.email);
        if (!backoff.allowed) {
          throw new Error(`Too many failed attempts. Wait ${Math.ceil(backoff.waitTimeMs / 1000)}s.`);
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email });
        if (!user || !user.password) {
          recordFailedAuth(credentials.email);
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          recordFailedAuth(credentials.email);
          return null;
        }

        resetFailedAuth(credentials.email);
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === 'github' && user) {
        try {
          await dbConnect();
          let dbUser = await User.findOne({ email: user.email });
          if (!dbUser) {
            dbUser = await User.create({
              name: user.name || 'GitHub User',
              email: user.email,
              role: 'user',
              avatar: user.image || '',
            });
          }
          token.id = dbUser._id.toString();
          token.role = dbUser.role || 'user';
        } catch (err) {
          console.error('Error linking GitHub OAuth user:', err);
        }
      } else if (user) {
        token.role = user.role || 'user';
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role || 'user';
        session.user.id = token.id;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
