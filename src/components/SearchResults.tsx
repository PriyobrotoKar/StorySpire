"use client";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Blog } from "@/types/schemaTypes";
import { searchBlogs } from "@/utils/fetchActions";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import BlogArticleCard from "./BlogArticleCard";

const SearchResults = ({
  initialResults,
  total,
}: {
  initialResults: Blog[];
  total: number;
}) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const { items: blogs, ref } = useInfiniteScroll<Blog>(
    initialResults,
    searchBlogs,
    [query]
  );
  return (
    <div className="space-y-2">
      {blogs.map((blog) => {
        return <BlogArticleCard key={blog.id} blog={blog} size="large" />;
      })}
      {blogs.length !== total && (
        <div className="flex items-center justify-center" ref={ref}>
          <Image
            src="/loader.gif"
            alt="Loading Spinner"
            width={64}
            height={64}
          />
        </div>
      )}
    </div>
  );
};

export default SearchResults;
