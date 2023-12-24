import { Category } from "@/types/schemaTypes";
import { fetchAllCategories } from "@/utils/fetchActions";
import { capitalize, capitalizeSentence } from "@/utils/helpers";
import React from "react";

const CategoryList = async () => {
  const { categories }: { categories: Category[] } = await fetchAllCategories();
  return (
    <div className="flex gap-4 overflow-x-scroll">
      {categories.map((category) => {
        return (
          <div
            className="whitespace-nowrap rounded-xl bg-secondary px-4 py-2 text-sm"
            key={category.id}
          >
            {capitalizeSentence(category.name)}
          </div>
        );
      })}
    </div>
  );
};

export default CategoryList;
