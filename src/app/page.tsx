"use client";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
export default function Home() {
  return (
    <main>
      Homepage
      <Button onClick={() => signOut()}>signout</Button>
    </main>
  );
}
