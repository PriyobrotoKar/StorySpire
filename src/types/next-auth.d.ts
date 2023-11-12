import { User as UserPrisma } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User extends UserPrisma {}
  interface Profile {
    username: string;
    picture: string;
  }
  interface Session {
    user: {
      username: string;
    } & DefaultSession["user"];
  }
}
