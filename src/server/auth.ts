import { loginSchema } from "~/common/authSchema";

import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "~/server/db";
import { comparePassword } from "~/utils/passwordUtils";
import { type DBTags } from "~/components/InputCreatableSelect";
import { supabase } from "~/utils/storageBucket";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      atTag: string;
      dateOfBirth: Date;
      description: string | null;
      tags: DBTags;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    atTag: string;
    dateOfBirth: Date;
    description: string | null;
    tags: DBTags;
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt({ token, user }) {
      /* User table contents is exposed in tokens */
      if (user) {
        token.id = user.id;
        token.atTag = user.atTag;
        token.dateOfBirth = user.dateOfBirth;
        token.description = user.description;
        token.tags = user.tags;
      }
      return token;
    },
    session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.atTag = token.atTag as string;
        session.user.dateOfBirth = token.dateOfBirth as Date;
        session.user.description = token.description as string | null;
        session.user.tags = token.tags as DBTags;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. 'Sign in with...')
      name: "Email",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        const creds = await loginSchema.parseAsync(credentials);
        const user = await prisma.user.findFirst({
          where: { email: creds.email },
          select: {
            id: true,
            name: true,
            email: true,
            password: true,
            dateOfBirth: true,
            atTag: true,
            description: true,
            tags: true,
            image: true,
          },
        });

        if (!user) {
          return null;
        }

        // Maybe add password hashing here
        if (!comparePassword(user.password, creds.password)) {
          return null;
        }

        if (user) {
          console.log("User logged in : ", user);
        }

        // Getting public URL from supabase
        if (user.image) {
          const { data: getImageData } = supabase.storage
            .from("images")
            .getPublicUrl(`${user.image}`);
          
            user.image = getImageData.publicUrl;
        }

        return {
          ...user,
        };
      },
    }),
  ],
  // Provide your own pages here
  pages: {
    signIn: "/",
    // signOut: '/auth/signout',
    // error: '/auth/error', // Error code passed in query string as ?error=
    // verifyRequest: '/auth/verify-request', // (used for check email message)
    // newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
