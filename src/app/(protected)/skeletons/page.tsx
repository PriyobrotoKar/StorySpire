import { BlogPostSkeleton } from "@/components/skeletons/BlogPostCardSkeletons";
import CategoryListSkeletons from "@/components/skeletons/CategoryListSkeletons";
import FeaturedSkeletons from "@/components/skeletons/FeaturedSkeletons";
import TopicSkeletons from "@/components/skeletons/TopicSkeletons";
import React from "react";
import { v4 as uuid } from "uuid";

const page = () => {
  return (
    <div className="container mx-auto space-y-6 pt-20">
      <FeaturedSkeletons />
      <div className="ml-auto space-y-6 lg:w-4/6">
        {[
          ...Array(4).fill(
            <BlogPostSkeleton size="large" showAuthor={false} key={uuid()} />
          ),
        ]}
      </div>
      <CategoryListSkeletons />
      <TopicSkeletons />
    </div>
  );
};

export default page;
