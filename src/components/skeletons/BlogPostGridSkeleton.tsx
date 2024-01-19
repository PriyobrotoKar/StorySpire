import React from "react";
import { BlogPostSkeleton } from "./BlogPostCardSkeletons";
import { v4 as uuid } from "uuid";

const BlogPostGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr] gap-8 overflow-hidden sm:auto-rows-[0rem] sm:grid-cols-2  sm:gap-2  lg:grid-cols-3 2xl:grid-cols-4">
      {[...Array(4).fill(<BlogPostSkeleton key={uuid()} />)]}
    </div>
  );
};

export default BlogPostGridSkeleton;
