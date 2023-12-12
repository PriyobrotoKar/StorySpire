import client from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { cookies } from "next/headers";
import bcrypt from "bcrypt";

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
        //check if user exits
        const user = await client.user.findUnique({
          where: {
            email: credentials.email,
          },
        });
        if (!user) {
          return null;
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile, credentials }) {
      try {
        if (profile) {
          const user = await client.user.findUnique({
            where: {
              email: profile?.email,
            },
          });
          if (user) {
            profile.username = user.username;
            profile.picture = user.profile_pic || profile.picture;
            cookies().delete("profile_pic");
            cookies().delete("email");
            cookies().delete("fullname");
            return true;
          } else {
            cookies().set("profile_pic", profile.picture || "");
            cookies().set("email", profile.email || "");
            cookies().set("fullname", profile.name || "");
            return "/onboarding";
          }
        } else {
          //check if user is signed in with OAuth
          if (!user.password) {
            return true;
          }

          if (!credentials?.password) {
            return false;
          }

          const isPassMatch = await bcrypt.compare(
            credentials.password as string,
            user.password
          );
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
        token.picture = user.profile_pic;
        token.name = user.fullname;
      }
      if (profile) {
        token.username = profile.username;
        token.picture = profile.picture;
      }
      return token;
    },

    async session({ session, user, token }) {
      session.user.username = token.username;
      session.user.name = token.name;
      session.user.image = token.picture;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
};
