import SearchHeader from "@/components/SearchHeader";
import { ReactNode } from "react";

export default function SearchLayout({ children }: { children: ReactNode }) {
  return (
    <section className="container max-w-screen-md">
      <SearchHeader />

      {children}
    </section>
  );
}
