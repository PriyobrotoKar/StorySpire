import { BlogPreview } from "@/types/customTypes";
import { Blog } from "@/types/schemaTypes";
import { capitalize, formatDate, readingTime } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogArticleCard = ({
  blog,
  size,
}: {
  blog: Blog | BlogPreview;
  size?: "large" | "small";
}) => {
  return (
    <article className="my-6 space-y-4 rounded-md p-4 transition-colors hover:bg-card">
      <div
        className="text-md font-semibold"
        style={{ color: blog.categories[0]?.color }}
      >
        {blog.categories.length
          ? capitalize(blog.categories[0].name) + " • "
          : ""}
        {readingTime(blog.length)} mins
      </div>
      <div>
        <Link
          href={
            blog.author.username && blog.slug
              ? `/@${blog.author.username}/${blog.slug}`
              : "/write"
          }
        >
          <div
            className={`flex  gap-2 lg:gap-6 ${
              size === undefined
                ? " flex-col sm:flex-row-reverse"
                : size === "small"
                ? "flex-col"
                : "flex-row-reverse"
            }`}
          >
            {blog.thumbnail && (
              <div className="h-[12rem] flex-1 overflow-hidden sm:h-[8rem] lg:h-[10rem]">
                <Image
                  src={blog.thumbnail}
                  alt="Blog thumbnail"
                  width={250}
                  height={250}
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>
            )}
            <div className="flex-[2_1_0%] space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold leading-tight">
                  {blog.title}
                </h2>
                <p className="line-clamp-3 text-md leading-snug">
                  {blog.description}
                </p>
              </div>
              <div className=" text-sm font-semibold text-muted-foreground">
                {formatDate(blog.createdAt)}
              </div>
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
};

export default BlogArticleCard;
