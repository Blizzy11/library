import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getUserById } from "./models/user";
import bycrypt from "bcryptjs";
// Your own logic for dealing with plaintext password strings; be careful!

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      authorize: async (credentials) => {
        const prisma = new PrismaClient();
        const { username, password } = credentials;

        try {
          const user = await prisma.user.findUnique({
            where: {
              username: username as string,
            },
          });

          if (!user) {
            // throw new Error("User not found");

            throw new Error("User not found");
          }

          // Here you can also verify the password if needed
          // For example:
          // const isPasswordValid = await verifyPassword(password, user.password);
          // if (!isPasswordValid) {
          //   throw new Error("Invalid credentials");
          // }

          const isPasswordValid = await bycrypt.compare(
            password as string,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid credentials");
          }

          return user;
        } catch (error) {
          console.error("Error fetching user:", error);
          throw new Error("An error occurred while fetching user data.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      try {
        const existingUser = await getUserById(token.sub);

        if (existingUser) {
          token.role = existingUser.role;
        }
      } catch (error) {
        console.error("Error fetching user by ID:", error);
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub as string;
      }

      if (token.role && session.user) {
        session.user.role = token.role as string;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
});
