import React from "react";
import { Skeleton } from "../ui/skeleton";
import BlogPostGridSkeleton from "./BlogPostGridSkeleton";
import { v4 as uuid } from "uuid";

const TopicOverviewSkeleton = () => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-52" />
        <Skeleton className="h-8 w-20" />
      </div>
      <BlogPostGridSkeleton />
    </div>
  );
};
const TopicSkeletons = () => {
  return (
    <div>{[...Array(10).fill(<TopicOverviewSkeleton key={uuid()} />)]}</div>
  );
};

export default TopicSkeletons;
