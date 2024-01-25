import React from "react";
import { Skeleton } from "../ui/skeleton";

const FeatureBlogPostSkeleton = () => {
  return (
    <div className="space-y-4 lg:space-y-6 lg:p-12 2xl:space-y-10">
      <Skeleton className="h-4 w-[10rem] rounded-full" />
      <div className="flex flex-col gap-4  sm:flex-row-reverse 2xl:gap-10">
        <Skeleton className="h-48 w-full self-start rounded-xl sm:h-32 sm:shrink-0 sm:basis-48 md:h-auto md:basis-[18rem] md:self-stretch lg:basis-5/12" />
        <div className="space-y-4 sm:basis-full lg:space-y-6 2xl:space-y-8">
          <Skeleton className="h-16 rounded-xl lg:h-20 2xl:h-24" />
          <Skeleton className="hidden h-12 w-5/6 rounded-xl sm:block lg:h-20 2xl:h-24" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-10 rounded-full lg:h-12 lg:w-12" />
            <Skeleton className="h-6 w-[16rem] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

const BlogPostSkeleton = ({
  size = "small",
  showAuthor = true,
}: {
  size?: "small" | "large";
  showAuthor?: boolean;
}) => {
  return (
    <div className="space-y-4 lg:p-4">
      <Skeleton className="h-4 w-[10rem] rounded-full" />
      <div
        className={`flex  gap-4 ${
          size === "small" ? "flex-row-reverse sm:flex-col" : "flex-row-reverse"
        }`}
      >
        <Skeleton
          className={`h-32 shrink-0 basis-32  ${
            size === "small" ? "sm:basis-44" : "sm:h-40 sm:basis-64"
          }`}
        />
        <div className="flex basis-full flex-col justify-between gap-2">
          <Skeleton className="h-16 sm:h-14" />
          <Skeleton className="hidden sm:block sm:h-10 sm:w-3/4" />

          <div className="flex items-center  gap-2">
            {showAuthor && (
              <Skeleton className="h-8 shrink-0 basis-8 rounded-full lg:h-10 lg:basis-10" />
            )}
            <Skeleton className="h-5 basis-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export { FeatureBlogPostSkeleton, BlogPostSkeleton };
