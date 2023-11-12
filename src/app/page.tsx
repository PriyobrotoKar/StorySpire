"use client";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
export default function Home() {
  return (
    <div className="">
      <Button onClick={() => signOut()}>signout</Button>

      <section className="mt-16  space-y-6">
        <main className="space-y-4 text-center">
          <h1 className="mx-auto w-[22rem] text-3xl font-bold leading-tight text-secondary-foreground">
            Discover <span className="text-primary">Untold</span> Stories
          </h1>
          <p className="px-6 text-lg font-medium">
            Buckle up for a Blogging Adventure like Never Before
          </p>
        </main>
        <div className="mx-6 flex max-w-xl items-center gap-2 rounded-md border border-white px-4 shadow-lg focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1 sm:mx-auto">
          <FiSearch className="text-lg text-primary" />
          <Input
            type="text"
            placeholder="Search blogs by topic or keywords..."
            className="border-none  focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </section>
    </div>
  );
}
