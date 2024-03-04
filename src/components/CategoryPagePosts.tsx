"use client";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { BlogWithoutContent } from "@/types/schemaTypes";
import { fetchCategory } from "@/utils/fetchActions";
import React from "react";
import BlogArticleCard from "./BlogArticleCard";

const CategoryPagePosts = ({
  posts,
  categoryName,
}: {
  posts: BlogWithoutContent[];
  categoryName: String;
}) => {
  const { items: blogs, ref } = useInfiniteScroll<BlogWithoutContent>(
    posts,
    fetchCategory,
    [categoryName]
  );
  return (
    <section className="grid grid-cols-1 gap-8 overflow-hidden sm:grid-cols-2  sm:gap-2 lg:auto-rows-[0rem] lg:grid-cols-3 lg:grid-rows-1 2xl:grid-cols-4">
      {blogs.map((blog) => {
        return <BlogArticleCard size="small" key={blog.id} blog={blog} />;
      })}
    </section>
  );
};

export default CategoryPagePosts;
