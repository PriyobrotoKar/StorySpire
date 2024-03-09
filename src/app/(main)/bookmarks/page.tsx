import BlogArticleCard from "@/components/BlogArticleCard";
import BlogPostGridSkeleton from "@/components/skeletons/BlogPostGridSkeleton";
import { BlogWithoutContent } from "@/types/schemaTypes";
import { fetchBookmarks } from "@/utils/fetchActions";
import { Suspense } from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
};

const Blogs = async () => {
  const bookmarks: BlogWithoutContent[] = await fetchBookmarks();
  return (
    <section className="grid grid-cols-1 gap-8 overflow-hidden sm:grid-cols-2  sm:gap-2 lg:auto-rows-[0rem] lg:grid-cols-3 lg:grid-rows-1 2xl:grid-cols-4">
      {bookmarks.map((bookmark) => {
        return (
          <BlogArticleCard key={bookmark.id} blog={bookmark} size="small" />
        );
      })}
    </section>
  );
};

const page = () => {
  return (
    <div className="container mx-auto space-y-10">
      <section className="space-y-6">
        <main className="space-y-4 text-center">
          <h1 className="mx-auto w-[22rem] text-3xl font-bold leading-tight text-secondary-foreground">
            Reading <span className="text-primary">List</span>
          </h1>
          <p className="mx-6 text-lg font-medium ">
            Your Handpicked Highlights
          </p>
        </main>
        <Suspense fallback={<BlogPostGridSkeleton />}>
          <Blogs />
        </Suspense>
      </section>
    </div>
  );
};

export default page;
