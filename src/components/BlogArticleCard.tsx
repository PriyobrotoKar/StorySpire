import { BlogPreview } from "@/types/customTypes";
import { Blog } from "@/types/schemaTypes";
import { capitalize, formatDate, readingTime } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const BlogArticleCard = ({
  blog,
  size,
  showAuthor = true,
}: {
  blog: Blog | BlogPreview;
  showAuthor?: boolean;
  size?: "large" | "small";
}) => {
  console.log(blog);
  return (
    <article className="flex min-w-[10rem] flex-1  flex-col  gap-4 rounded-md transition-colors md:p-4 lg:hover:bg-card">
      <div
        className="text-md font-semibold"
        style={{ color: blog.categories[0]?.color }}
      >
        {blog.categories.length
          ? capitalize(blog.categories[0].name) + " • "
          : ""}
        {readingTime(blog.length)} mins
      </div>
      <div className="flex-1">
        <Link
          href={
            blog.author.username && blog.slug
              ? `/@${blog.author.username}/${blog.slug}`
              : "/write"
          }
        >
          <div
            className={`flex h-full gap-4 ${
              size === undefined
                ? " flex-col sm:flex-row-reverse"
                : size === "small"
                ? "flex-col"
                : "flex-row-reverse"
            }`}
          >
            {blog.thumbnail && (
              <div
                className={
                  "overflow-hidden " +
                  (size === "small" ? "flex-[0_0_12rem]" : "")
                }
              >
                <Image
                  src={blog.thumbnail}
                  alt="Blog thumbnail"
                  width={250}
                  height={250}
                  className="h-full w-full rounded-xl object-cover"
                />
              </div>
            )}
            <div className="flex  flex-1 flex-col justify-between gap-4 lg:flex-[2_1_0%]">
              <div className="space-y-2">
                <h2 className="text-lg font-semibold leading-tight">
                  {blog.title}
                </h2>
                <p className="line-clamp-3 text-md leading-snug">
                  {blog.description}
                </p>
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-muted-foreground">
                {showAuthor && (
                  <>
                    <Link href={`/@${blog.author.username}`}>
                      <div className="group  flex items-center gap-2">
                        <div className="aspect-square w-8 overflow-hidden rounded-full">
                          <Image
                            className="h-full w-full object-cover "
                            src={
                              blog.author.profile_pic ||
                              "/images/avatarFallback.png"
                            }
                            alt="Author Profile Picture"
                            width={32}
                            height={32}
                          />
                        </div>
                        <div className="group-hover:underline">
                          {blog.author.fullname}
                        </div>
                      </div>
                    </Link>
                    <span>•</span>
                  </>
                )}
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
