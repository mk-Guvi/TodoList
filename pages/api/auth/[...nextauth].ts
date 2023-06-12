import { compare } from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { connectMongo, UsersModel } from '../../../database';

export default NextAuth({
  secret: process.env?.AUTH_SECRET,
  pages: {
    signOut: '/',
  },
  session: {
    maxAge: 604800, // Set the session max age to 7 days (604,800 seconds)
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'Enter your email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(creds) {
        await connectMongo().catch(() => {
          return 'Something went wrong!';
        });

        const result: any = await UsersModel.findOne({
          email: creds?.email,
        });

        if (!result) {
          throw new Error('No User Found');
        }

        const checkPassword = await compare(creds?.password || '', result?.password);
        if (!checkPassword || result?.email !== creds?.email) {
          throw new Error('Invalid Credentials');
        }

        return result;
      },
    }),
  ],
  callbacks: {
    signIn: async (props) => {
      try {
        if (props?.account?.error) {
          return Promise.resolve(false);
        }
        return Promise.resolve(true);
      } catch (error) {
        return Promise.resolve(false); // Return false to abort the sign-in process
      }
    },
  },
});
