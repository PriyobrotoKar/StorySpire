import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import {
  fetchFeaturedBlogs,
  fetchRecentBlogs,
  sleep,
} from "@/utils/fetchActions";
import { Blog } from "@/types/schemaTypes";
import BlogArticleCard from "@/components/BlogArticleCard";
import { Suspense } from "react";
import FeaturedSkeletons from "@/components/skeletons/FeaturedSkeletons";
import BlogPostGridSkeleton from "@/components/skeletons/BlogPostGridSkeleton";

const RecentBlogs = async () => {
  const recentBlogs: Blog[] = await fetchRecentBlogs(4);
  return (
    <div className="grid grid-cols-1 gap-8 overflow-hidden sm:auto-rows-[0rem]  sm:grid-cols-2 sm:grid-rows-2 sm:gap-2 lg:grid-cols-3 lg:grid-rows-1 2xl:grid-cols-4">
      {recentBlogs.map((blog) => {
        return <BlogArticleCard size="small" key={blog.id} blog={blog} />;
      })}
    </div>
  );
};

const FeaturedBlogs = async () => {
  const featuredBlogs: Blog[] = await fetchFeaturedBlogs();

  return (
    <section className="grid grid-cols-1 grid-rows-[auto_1fr] gap-8 overflow-hidden sm:auto-rows-[0rem] sm:grid-cols-2  sm:gap-2  lg:grid-cols-3 2xl:grid-cols-4">
      <div className="sm:col-span-2 lg:col-span-3 2xl:col-span-4">
        <BlogArticleCard blog={featuredBlogs[0]} isFeatured />
      </div>
      {featuredBlogs.map((blog, i: number) => {
        if (i === 0) return;
        return <BlogArticleCard size={"small"} key={blog.id} blog={blog} />;
      })}
    </section>
  );
};

export default async function Home() {
  return (
    <div>
      <section className="space-y-6 ">
        <main className="space-y-4 text-center">
          <h1 className="mx-auto w-[22rem] text-3xl font-bold leading-tight text-secondary-foreground">
            Discover <span className="text-primary">Untold</span> Stories
          </h1>
          <p className="mx-6 text-lg font-medium ">
            Buckle up for a Blogging Adventure like Never Before
          </p>
        </main>
        <div className=" mx-6 flex max-w-xl items-center gap-2 rounded-md border border-white px-4 shadow-lg focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1 sm:mx-auto">
          <FiSearch className="text-lg text-primary" />
          <Input
            type="text"
            placeholder="Search blogs by topic or keywords..."
            className="border-none  focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </section>
      <div className="container mx-auto mt-10 space-y-10">
        <Suspense fallback={<FeaturedSkeletons />}>
          <FeaturedBlogs />
        </Suspense>
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Recent Blogs</h2>
          <Suspense fallback={<BlogPostGridSkeleton />}>
            <RecentBlogs />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
