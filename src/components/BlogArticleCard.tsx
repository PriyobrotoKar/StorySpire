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
  isFeatured = false,
}: {
  blog: Blog | BlogPreview;
  showAuthor?: boolean;
  size?: "large" | "small";
  isFeatured?: boolean;
}) => {
  return (
    <article
      className={
        "group flex min-w-[10rem]  flex-1  flex-col gap-4  transition-colors lg:hover:bg-card " +
        (isFeatured ? "rounded-3xl md:p-12" : "rounded-md md:p-4")
      }
    >
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
        <div
          className={`flex h-full gap-4 ${
            size === undefined
              ? isFeatured
                ? "flex-col lg:flex-row-reverse lg:gap-20"
                : " flex-col sm:flex-row-reverse lg:gap-20 "
              : size === "small"
              ? "flex-col"
              : "flex-row-reverse"
          }`}
        >
          <div
            className={
              "overflow-hidden rounded-xl transition-shadow duration-500 " +
              (size === undefined
                ? "h-[10rem] lg:flex-1"
                : size === "small"
                ? "flex-[0_0_12rem]"
                : "") +
              (isFeatured
                ? " h-[12rem] sm:h-[18rem]  md:shadow-xl md:group-hover:shadow-2xl lg:h-[18rem]"
                : "")
            }
          >
            <Link
              href={
                blog.author.username && blog.slug
                  ? `/@${blog.author.username}/${blog.slug}`
                  : "/write"
              }
            >
              <Image
                src={blog.thumbnail || "/images/blogFallback.png"}
                alt="Blog thumbnail"
                width={500}
                height={300}
                className="h-full w-full  object-cover"
              />
            </Link>
          </div>

          <div
            className={
              "flex  flex-1 flex-col justify-between gap-4 " +
              (isFeatured ? "2xl:flex-[2_1_0%]" : "sm:flex-[2_1_0%]")
            }
          >
            <Link
              href={
                blog.author.username && blog.slug
                  ? `/@${blog.author.username}/${blog.slug}`
                  : "/write"
              }
            >
              <div className="space-y-2">
                <h2
                  className={
                    " font-semibold leading-tight " +
                    (isFeatured
                      ? " text-xl font-bold lg:text-2xl 2xl:text-3xl"
                      : "text-lg")
                  }
                >
                  {blog.title}
                </h2>
                <p
                  className={
                    "line-clamp-3 leading-snug" +
                    (isFeatured
                      ? " font-medium lg:text-lg 2xl:text-xl"
                      : "text-md ")
                  }
                >
                  {blog.description}
                </p>
              </div>
            </Link>
            <div
              className={
                "flex items-center gap-1 font-semibold text-muted-foreground " +
                (isFeatured ? "text-base" : "text-sm")
              }
            >
              {showAuthor && (
                <>
                  <Link href={`/@${blog.author.username}`}>
                    <div className="group/author  flex items-center gap-2">
                      <div
                        className={
                          "aspect-square  overflow-hidden rounded-full " +
                          (isFeatured ? "w-10" : "w-8")
                        }
                      >
                        <Image
                          className="h-full w-full object-cover "
                          src={
                            blog.author.profile_pic ||
                            "/images/avatarFallback.png"
                          }
                          alt="Author Profile Picture"
                          width={48}
                          height={48}
                        />
                      </div>
                      <div className="group-hover/author:underline">
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
      </div>
    </article>
  );
};

export default BlogArticleCard;
