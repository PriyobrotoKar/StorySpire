import {
  checkIsFollowing,
  fetchBlogViews,
  fetchSingleBlog,
  fetchSingleUser,
} from "@/utils/fetchActions";
import Image from "next/image";
import React from "react";
import edjsHTML from "editorjs-html";
import parse from "html-react-parser";
import { v4 as uuid } from "uuid";
import "highlight.js/styles/github.css";
import styles from "./styles.module.css";
import { Button } from "@/components/ui/button";
import { LuEye } from "react-icons/lu";
import { IoHeartOutline, IoHeartSharp } from "react-icons/io5";
import { TbMessageCircle2 } from "react-icons/tb";
import { CiBookmark } from "react-icons/ci";
import { capitalize, formatDate, readingTime } from "@/utils/helpers";
import { Blog, User } from "@/types/schemaTypes";
import Codeblock from "@/components/Codeblock";
import { colors } from "@/constants/colors";
import { notFound } from "next/navigation";
import BlogPostActions from "@/components/BlogPostActions";
import BlogPostBookmark from "@/components/BlogPostBookmark";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import BlogPostLike from "@/components/BlogPostLike";
import FollowUserButton from "@/components/FollowUserButton";

const page = async ({
  params,
}: {
  params: { username: string; blog: string };
}) => {
  const edjsParser = edjsHTML();
  const { username, blog: slug } = params;
  const session = await getServerSession(authOptions);

  const user: User = session
    ? await fetchSingleUser(session.user.username)
    : null;

  const blog: Blog & {
    isBookmarked: boolean;
    isLiked: Boolean;
    _count: { Like: number };
  } = await fetchSingleBlog(slug);
  if (!blog) {
    return notFound();
  }
  const isSameUser = session
    ? session.user.username === blog.author.username
    : false;
  const { isFollowing } =
    session && !isSameUser
      ? await checkIsFollowing(session.user.username, blog.author.username)
      : { isFollowing: false };
  const html = edjsParser.parse(blog.content as any);
  const { views } = await fetchBlogViews(blog.slug);

  return (
    <>
      <section
        className={
          "relative flex h-[25rem] flex-col items-center gap-4  bg-blue-400 py-20 text-white before:absolute  before:left-0 before:top-0 before:h-full before:w-full before:bg-white/30 sm:h-[28rem] md:h-[35rem] lg:h-[42rem] lg:gap-10"
        }
        style={{
          backgroundColor:
            blog.categories[0]?.color ||
            colors[Number((Math.random() * 10).toFixed(0))],
        }}
      >
        <div className="relative z-10 mt-10 font-medium">
          {blog.categories.length
            ? capitalize(blog.categories[0].name) + " • "
            : ""}
          {readingTime(blog.length)} mins
        </div>

        <h1 className="relative z-10  mx-auto text-center text-xl font-bold leading-tight sm:container sm:text-2xl md:text-3xl lg:max-w-3xl">
          {blog.title}
        </h1>

        <div className="relative z-10 flex items-center gap-4">
          <div className="aspect-square w-12 overflow-hidden rounded-full shadow-xl lg:w-16">
            <Image
              src={blog.author.profile_pic || "/images/avatarFallback.png"}
              alt="Author Profile Picture"
              width={90}
              height={90}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold">{blog.author.fullname}</div>
            <div className="text-sm text-white/80">
              {formatDate(blog.createdAt)}
            </div>
          </div>
        </div>

        {/* <BlogPostActions blog={blog} user={user} /> */}
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <LuEye className="text-xl" />
            <p>{views}</p>
          </div>
          <BlogPostLike blog={blog} user={user} />
          <BlogPostBookmark blog={blog} user={user} />
        </div>
      </section>

      {blog.thumbnail && (
        <section className="mx-auto h-[14rem] max-w-[25rem] px-4 sm:h-[14rem] sm:w-[35rem] sm:max-w-full md:h-[14rem] lg:h-[25rem] lg:w-full lg:max-w-4xl">
          <div className="h-[calc(100%+2rem)] w-full -translate-y-16 overflow-hidden rounded-3xl shadow-2xl  sm:-translate-y-20 lg:h-[calc(100%+5rem)] lg:-translate-y-32">
            <Image
              src={blog.thumbnail}
              alt="Thumbnail"
              width={1200}
              height={800}
              className="my-0 h-full w-full object-cover "
            />
          </div>
        </section>
      )}

      <section className="mx-auto my-10 max-w-sm px-6 lg:container   sm:max-w-lg lg:max-w-3xl">
        <div className={styles.content}>
          {html.map((item) => {
            if (item.includes("<code>")) {
              const innerHTML = item.substring(
                item.indexOf(">", item.indexOf("<code>")) + 1,
                item.indexOf("</code>")
              );
              return <Codeblock key={uuid()}>{innerHTML}</Codeblock>;
            }
            const element =
              item.substring(0, item.indexOf(">")) +
              ` key=${uuid()}` +
              item.substring(item.indexOf(">"));
            return parse(element);
          })}
        </div>
      </section>

      <section className="mx-6 my-20 flex  items-center gap-2 border-y py-8 lg:container sm:mx-auto  sm:max-w-lg sm:gap-6 sm:px-6 lg:max-w-3xl   lg:gap-10">
        <div className="flex items-center gap-2 sm:gap-6 lg:gap-10">
          <div className="aspect-square w-12  flex-shrink-0 overflow-hidden rounded-full shadow-xl sm:w-14 lg:w-16">
            <Image
              src={blog.author.profile_pic || "/images/avatarFallback.png"}
              alt="Author Profile Picture"
              width={60}
              height={60}
              className=" h-full w-full object-cover"
            />
          </div>
          <div>
            <div className="font-semibold text-muted-foreground">
              Written By
            </div>
            <div className="text-lg font-semibold">{blog.author.fullname}</div>
            <div className="line-clamp-2  text-md text-muted-foreground">
              {blog.author.bio}
            </div>
          </div>
        </div>
        <FollowUserButton
          showDesc={false}
          isFollowing={isFollowing}
          targetUsername={blog.author.username}
          followerCount={blog.author._count.follower}
          isSameUser={isSameUser}
        />
      </section>

      <section className="mx-4">
        <h2 className="text-center">More from {blog.author.fullname}</h2>
      </section>
    </>
  );
};

export default page;
