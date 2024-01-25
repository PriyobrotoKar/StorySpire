import React from "react";
import {
  BlogPostSkeleton,
  FeatureBlogPostSkeleton,
} from "./BlogPostCardSkeletons";
import { v4 as uuid } from "uuid";

const FeaturedSkeletons = () => {
  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr] gap-8 overflow-hidden sm:auto-rows-[0rem] sm:grid-cols-2  sm:gap-2  lg:grid-cols-3 2xl:grid-cols-4">
      <div className="sm:col-span-2 lg:col-span-3 2xl:col-span-4">
        <FeatureBlogPostSkeleton />
      </div>
      {[...Array(4).fill(<BlogPostSkeleton key={uuid()} />)]}
    </div>
  );
};

export default FeaturedSkeletons;
