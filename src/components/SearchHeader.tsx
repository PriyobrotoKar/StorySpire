"use client";
import { capitalizeSentence } from "@/utils/helpers";
import { useSearchParams } from "next/navigation";
import SearchBar from "./SearchBar";
import TabGroup from "./TabGroup";

const SearchHeader = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  if (!query) {
    return;
  }
  const tabs = [
    { id: "blogs", label: "Blogs", link: `/search/blogs?q=${query}` },
    { id: "people", label: "People", link: `/search/users?q=${query}` },
    { id: "topics", label: "Topics", link: `/search/topics?q=${query}` },
  ];
  return (
    <div className="space-y-4">
      <h1 className="mx-auto w-fit text-3xl font-bold leading-tight text-secondary-foreground">
        {capitalizeSentence(query)}
      </h1>
      <SearchBar />
      <div className="border-b py-2">
        <TabGroup tabs={tabs} />
      </div>
    </div>
  );
};

export default SearchHeader;
