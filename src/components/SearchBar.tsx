"use client";

import { Blog, Category, User } from "@/types/schemaTypes";
import { fetchDataFromApi } from "@/utils/fetchData";
import { capitalizeSentence } from "@/utils/helpers";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
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
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  let isNoResultsFound = false;
  const [ref, { height }] = useMeasure();
  if (
    searchResults &&
    !searchResults.blogs.length &&
    !searchResults.authors.length &&
    !searchResults.topics.length
  ) {
    isNoResultsFound = true;
  }
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (value) {
      setIsLoading(true);
      router.push(
        `${pathname === "/search" ? "/search/blogs" : pathname}?q=${value}`
      );
    }
  };

  useEffect(() => {
    if (!value) {
      setSearchResults(null);
      return;
    }

    const handleSearch = async () => {
      console.log("search is called", value);
      if (value === "") {
        return;
      }

      const res = await fetchDataFromApi("/api/searchSuggestions", {
        q: value,
      });
      setSearchResults(res);
    };

    const timer = setTimeout(() => {
      handleSearch();
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, [value]);

  return (
    <div className="relative z-20 h-10">
      <motion.div
        animate={{ height: height ? height + 2 : 42 }}
        transition={{ ease: "easeOut" }}
        className="absolute left-1/2 w-10/12 max-w-xl -translate-x-1/2 overflow-hidden rounded-md border border-white bg-background/80 shadow-lg backdrop-blur focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1 sm:mx-auto"
      >
        <div ref={ref}>
          <div className="relative flex items-center gap-2 px-4">
            <FiSearch className="text-lg text-primary" />
            <form className=" flex-1" onSubmit={handleSubmit}>
              <Input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search blogs by topic or keywords..."
                className="border-none px-0  focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </form>
            {isLoading && (
              <Loader2 className="absolute right-3 h-5 w-5 animate-spin" />
            )}
          </div>
          <div className={`space-y-1 px-4 ${searchResults ? "pb-2" : ""}`}>
            {isNoResultsFound && (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No results found for this search
              </p>
            )}
            {searchResults && searchResults.blogs.length !== 0 && (
              <div>
                <p className="px-1 text-md font-medium">Blogs</p>
                <div>
                  {searchResults.blogs.map((blog) => {
                    return (
                      <Link
                        key={blog.id}
                        href={`/@${blog.author.username}/${blog.slug}`}
                      >
                        <div className="flex items-center gap-2 rounded-sm px-2 py-1 text-sm hover:bg-secondary/50">
                          <TiDocumentText className={"min-w-min text-base"} />
                          <p className="line-clamp-1">{blog.title}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {searchResults && searchResults.authors.length !== 0 && (
              <div>
                <p className="px-1 text-md font-medium">People</p>
                <div>
                  {searchResults.authors.map((people) => {
                    return (
                      <Link
                        key={people.id}
                        href={`/@${people.username}`}
                        className="block"
                      >
                        <div className="flex items-center gap-2 rounded-sm px-2 py-1 text-sm hover:bg-secondary/50">
                          <div className="h-6 w-6 overflow-hidden rounded-full">
                            <Image
                              className="h-full w-full object-cover"
                              src={
                                people.profile_pic ||
                                "/images/avatarFallback.png"
                              }
                              alt="profile_pic"
                              width={24}
                              height={24}
                            />
                          </div>
                          <p>{people.fullname}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {searchResults && searchResults.topics.length !== 0 && (
              <div>
                <p className="px-1 text-md font-medium">Topics</p>
                <div>
                  {searchResults.topics.map((topic) => {
                    return (
                      <Link key={topic.id} href={`/explore/${topic.name}`}>
                        <div className="flex items-center gap-2 rounded-sm px-2 py-1 text-sm hover:bg-secondary/50">
                          <p style={{ color: topic.color }}>•</p>
                          <p>{capitalizeSentence(topic.name)}</p>
                        </div>
                      </Link>
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
