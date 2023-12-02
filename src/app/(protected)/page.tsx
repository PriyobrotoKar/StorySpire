import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

import { FiSearch } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { fetchRecentBlogs } from "@/utils/fetchActions";
import { Blog } from "@/types/schemaTypes";
import BlogArticleCard from "@/components/BlogArticleCard";

const RecentBlogs = ({ blogs }: { blogs: Blog[] }) => {
  return (
    <section>
      <h2 className="text-xl font-bold">Recent Blogs</h2>
      <div className="grid grid-cols-1 gap-8 overflow-hidden sm:grid-cols-2  sm:gap-2 lg:auto-rows-[0rem] lg:grid-cols-3 lg:grid-rows-1 2xl:grid-cols-4">
        {blogs.map((blog) => {
          return <BlogArticleCard size={"small"} key={blog.id} blog={blog} />;
        })}
      </div>
    </section>
  );
};

export default async function Home() {
  const recentBlogs = await fetchRecentBlogs(4);
  return (
    <div>
      <section className="space-y-6 pt-10 sm:pt-28">
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
      <div className="container mx-auto mt-10">
        <RecentBlogs blogs={recentBlogs} />
      </div>
    </div>
  );
}
