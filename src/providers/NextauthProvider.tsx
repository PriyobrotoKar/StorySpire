"use client";
import { SessionProvider } from "next-auth/react";

const NextauthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextauthProvider;
