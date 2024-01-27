"use client";

import { Blog, Category, User } from "@/types/schemaTypes";
import { fetchDataFromApi } from "@/utils/fetchData";
import { capitalizeSentence } from "@/utils/helpers";
import { motion } from "framer-motion";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { TiDocumentText } from "react-icons/ti";
import useMeasure from "react-use-measure";
import { Input } from "./ui/input";

interface searchResultsProps {
  blogs: Blog[];
  authors: User[];
  topics: Category[];
}

const SearchBar = () => {
  const [value, setValue] = useState("");
  const [searchResults, setSearchResults] = useState<searchResultsProps | null>(
    null
  );
  const [ref, { height }] = useMeasure();

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value === "") {
      setSearchResults(null);
      return;
    }

    const res = await fetchDataFromApi("/api/search", { q: value });
    setSearchResults(res);
  };

  return (
    <div className="relative h-10">
      <motion.div
        animate={{ height }}
        transition={{ ease: "easeOut" }}
        className="absolute left-1/2 w-10/12 max-w-xl -translate-x-1/2 overflow-hidden rounded-md border border-white bg-background/80 px-4 shadow-lg backdrop-blur focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1 sm:mx-auto"
      >
        <div ref={ref}>
          <div className="flex items-center gap-2">
            <FiSearch className="text-lg text-primary" />
            <form className="flex-1" onSubmit={handleSearch}>
              <Input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search blogs by topic or keywords..."
                className="border-none px-0  focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </form>
          </div>
          <div className={`space-y-1 ${searchResults && "pb-2"}`}>
            {searchResults && searchResults.blogs.length !== 0 && (
              <div>
                <p className="text-md font-medium">Blogs</p>
                <div>
                  {searchResults.blogs.map((blog) => {
                    return (
                      <div
                        className="flex items-center gap-2 text-sm"
                        key={blog.id}
                      >
                        <TiDocumentText className={"min-w-min text-base"} />
                        <p className="line-clamp-1">{blog.title}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {searchResults && searchResults.authors.length !== 0 && (
              <div>
                <p className="text-md font-medium">People</p>
                <div className="space-y-1">
                  {searchResults.authors.map((people) => {
                    return (
                      <div
                        className="flex items-center gap-2 text-sm"
                        key={people.id}
                      >
                        <div className="h-6 w-6 overflow-hidden rounded-full">
                          <Image
                            className="h-full w-full object-cover"
                            src={
                              people.profile_pic || "/images/avatarFallback.png"
                            }
                            alt="profile_pic"
                            width={24}
                            height={24}
                          />
                        </div>
                        <p>{people.fullname}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {searchResults && searchResults.topics.length !== 0 && (
              <div>
                <p className="text-md font-medium">Topics</p>
                <div>
                  {searchResults.topics.map((topic) => {
                    return (
                      <div
                        className="flex items-center gap-2 text-sm"
                        key={topic.id}
                      >
                        <p style={{ color: topic.color }}>•</p>
                        <p>{capitalizeSentence(topic.name)}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchBar;
