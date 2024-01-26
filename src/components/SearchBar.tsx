"use client";

import { fetchDataFromApi } from "@/utils/fetchData";
import { FormEvent, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { Input } from "./ui/input";

const SearchBar = () => {
  const [value, setValue] = useState("");

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetchDataFromApi("/api/search", { q: value });
  };

  return (
    <div className=" mx-6 flex max-w-xl items-center gap-1 rounded-md border border-white px-4 shadow-lg focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1 sm:mx-auto">
      <FiSearch className="text-lg text-primary" />
      <form className="flex-1" onSubmit={handleSearch}>
        <Input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search blogs by topic or keywords..."
          className="border-none  focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </form>
    </div>
  );
};

export default SearchBar;
