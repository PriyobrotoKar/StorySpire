import client from "@/lib/prisma";
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("signin called");
      try {
        const user = await client.user.findUnique({
          where: {
            email: profile?.email,
          },
        });
        if (user) return true;
        else return "/onboarding";
      } catch (error: any) {
        console.error("GET user error", error.message);
        return false;
      }
    },
    async jwt({ token, profile }) {
      console.log("jwt called");
      return token;
    },
    async session({ session, user, token }) {
      console.log("session called");
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/login",
  },
};
