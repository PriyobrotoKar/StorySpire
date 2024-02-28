import { BlogPreview } from "@/types/customTypes";
import { BlogWithoutContent } from "@/types/schemaTypes";
import { capitalize, formatDate, readingTime } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarImage } from "./ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { Separator } from "./ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
const BlogArticleCard = ({
  blog,
  size = "large",
  showAuthor = true,
  showTopic = true,
  isFeatured = false,
  disableHoverCard = false,
}: {
  blog: BlogPreview | BlogWithoutContent;
  showAuthor?: boolean;
  size?: "large" | "small";
  showTopic?: boolean;
  isFeatured?: boolean;
  disableHoverCard?: boolean;
}) => {
  const layout = (isFeatured && "isFeatured") || size;
  return (
    <article
      className={
        "group flex min-w-[10rem]  flex-1  flex-col gap-4  transition-colors lg:hover:bg-card " +
        (isFeatured ? "rounded-3xl lg:p-12" : "rounded-md md:p-4")
      }
    >
      <div className="flex items-center justify-between gap-4">
        <div
          className={`font-semibold  ${
            layout === "isFeatured" ? "text-md" : "text-sm lg:text-md"
          }`}
          style={{ color: blog.categories[0]?.color }}
        >
          {showTopic && blog.categories.length
            ? capitalize(blog.categories[0].name) + " • "
            : ""}
          {readingTime(blog.length)} mins
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={"ghost"}
              size={"sm"}
              className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:bg-accent data-[state=open]:text-foreground data-[state=open]:opacity-100"
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" font-medium">
            <a
              href={
                blog.isPublished
                  ? `/write/${blog.slug}`
                  : `/write/draft/${blog.slug}`
              }
            >
              <DropdownMenuItem>
                <Pencil size={16} />
                Edit
              </DropdownMenuItem>
            </a>
            <DropdownMenuItem className="focus:bg-primary/10 focus:text-primary">
              <Trash2 size={16} />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1">
        <div
          className={`flex h-full  gap-4 ${
            layout === "small" && "flex-row-reverse sm:flex-col"
          } ${layout === "isFeatured" && "flex-col sm:flex-row-reverse"} ${
            layout === "large" && "flex-row-reverse lg:gap-10"
          }`}
        >
          <div
            className={`h-[8rem]  overflow-hidden rounded-xl transition-shadow  ${
              layout === "small" && "flex-[0_0_8rem] sm:flex-[0_0_12rem]"
            } ${
              layout === "isFeatured" &&
              " flex-[0_0_12rem] md:h-[12rem] md:flex-[0_0_18rem] lg:h-[16rem] lg:flex-[0_0_24rem] 2xl:h-[20rem] 2xl:flex-[0_0_32rem]"
            } ${
              layout === "large" &&
              "flex-[0_0_8rem] sm:h-[10rem] sm:flex-[0_0_16rem] lg:h-[8rem] lg:flex-[0_0_12rem] 2xl:h-[10rem] 2xl:flex-[0_0_16rem]"
            }`}
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

          <div className={`flex  flex-1 flex-col justify-between gap-4`}>
            <Link
              href={
                blog.author.username && blog.slug
                  ? `/@${blog.author.username}/${blog.slug}`
                  : "/write"
              }
              className="flex-1"
            >
              <div className="space-y-2">
                <h2
                  className={
                    " line-clamp-3 font-semibold leading-tight  " +
                    (layout === "isFeatured" &&
                      " text-xl font-bold lg:text-2xl 2xl:text-3xl ") +
                    (layout === "small" && " text-lg") +
                    (layout === "large" && " text-lg sm:text-xl")
                  }
                >
                  {blog.title}
                </h2>
                <p
                  className={
                    "hidden leading-snug " +
                    (isFeatured
                      ? " font-medium sm:line-clamp-2 lg:text-lg xl:line-clamp-3 2xl:text-xl "
                      : "text-md sm:line-clamp-2 ")
                  }
                >
                  {blog.description}
                </p>
              </div>
            </Link>
            <div
              className={
                "flex items-center gap-1  font-semibold text-muted-foreground " +
                (layout === "isFeatured" ? "text-base xl:text-lg" : "text-sm ")
              }
            >
              {showAuthor && (
                <>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Link
                        className="min-w-0"
                        href={`/@${blog.author.username}`}
                      >
                        <div className="group/author flex  items-center gap-2">
                          <div
                            className={
                              "aspect-square flex-initial overflow-hidden rounded-full " +
                              (isFeatured ? "w-10" : " flex-[0_0_2rem] sm:w-8")
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
                          <div className=" truncate group-hover/author:underline">
                            {blog.author.fullname}
                          </div>
                        </div>
                      </Link>
                    </HoverCardTrigger>
                    {!disableHoverCard && (
                      <HoverCardContent className="w-80">
                        <div className="flex justify-between space-x-4">
                          <Avatar>
                            <AvatarImage
                              className="h-full w-full object-cover"
                              src={
                                blog.author.profile_pic ||
                                "/images/avatarFallback.png"
                              }
                            />
                          </Avatar>
                          <div className="space-y-2">
                            <h4 className="text-md font-semibold">
                              {blog.author.fullname}
                            </h4>
                            <p className="line-clamp-2 text-sm">
                              {blog.author.bio}
                            </p>
                            <Separator />
                            <div className="flex items-center justify-evenly text-sm">
                              <div className="text-center">
                                <div>{blog.author._count.blogs}</div>
                                <div>Articles</div>
                              </div>
                              <Separator
                                className="self-stretch"
                                orientation="vertical"
                              />
                              <div className="text-center">
                                <div>{blog.author._count.follower}</div>
                                <div>Followers</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </HoverCardContent>
                    )}
                  </HoverCard>
                  <span>•</span>
                </>
              )}
              <p className="flex-[0_0_auto]">{formatDate(blog.createdAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogArticleCard;
