import { NextAuthOptions, User as NextAuthUser, Session } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import bcryptpass from "@/utils/bcryptpass";
import { prisma } from "@/lib/prisma";
export const Authoptions: NextAuthOptions = {
  providers: [
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email or Password is Requeired");
        }
        try {
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (!user || !user.hashedPassword) {
            throw new Error("no user found with this username");
          }

          const isPasswordCorrect = await bcryptpass.comparePassword(
            credentials.password,
            user.hashedPassword,
          );
          if (isPasswordCorrect) {
            const { hashedPassword, ...filteredUser } = user;
            return filteredUser;
          } else {
            throw new Error("Incorrrect password");
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signup",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
