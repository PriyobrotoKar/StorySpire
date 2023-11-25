import client from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { cookies } from "next/headers";
import bcrypt from "bcrypt";

let isPassMatch: Boolean = true;

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", placeholder: "Enter email" },
        password: { label: "Password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email) {
          return null;
        }
        console.log("credentials email", credentials.email);
        //check if user exits
        const user = await client.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          console.log("user does not exist");
          return null;
        }
        //check if user is signed in with OAuth
        if (!user.password) {
          return user;
        }

        //check if passwords match
        isPassMatch = await bcrypt.compare(credentials.password, user.password);

        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      try {
        if (profile) {
          const user = await client.user.findUnique({
            where: {
              email: profile?.email,
            },
          });
          if (user) {
            profile.username = user.username;
            cookies().delete("profile_pic");
            cookies().delete("email");
            cookies().delete("fullname");
            return true;
          } else {
            console.log(profile);
            cookies().set("profile_pic", profile.picture || "");
            cookies().set("email", profile.email || "");
            cookies().set("fullname", profile.name || "");
            return "/onboarding";
          }
        } else {
          return isPassMatch ? true : false;
        }
      } catch (error: any) {
        console.error("GET user error", error.message);
        return false;
      }
    },

    async jwt({ token, user, profile }) {
      if (user) {
        token.username = user.username;
      }
      if (profile) {
        token.username = profile.username;
      }
      return token;
    },

    async session({ session, user, token }) {
      session.user.username = token.username;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
};
