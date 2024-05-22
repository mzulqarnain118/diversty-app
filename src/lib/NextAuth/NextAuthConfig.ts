import CredentialProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";

import prisma from "@/lib/prisma";
import { compareHash } from "@/utils";
import { getUserByEmail } from "../prisma/user";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 1,
  },
  pages: {
    signIn: "/auth/signin",
    error: '/login'
  },
  debug: process.env.ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };

        const user = await getUserByEmail(email);

        if (!user) throw new Error("Email Not Found");

        let res = await compareHash(password, user.password!);

        if (!res) throw new Error("Invalid Credentials");

        return user;
      },
    }),
  ],

  callbacks: {
    jwt: async ({ token, user }) => {
      const u = await getUserByEmail(token.email as string);
      token.id = u?.id as string;
      token.emailVerified = u?.emailVerified;
      token.role = u?.role || "USER";
      token.company = u?.company || "";
      return token;
    },
    session: async ({ session, token }) => {
      session.user.emailVerified = token?.emailVerified as Date;
      session.user.id = token?.id as string;
      session.user.role = token.role
      session.user.company = token.company
      return session;
    },
  },
};
