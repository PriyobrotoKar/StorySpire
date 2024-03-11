import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import BlogArticleCard from "@/components/BlogArticleCard";
import BlogPostBookmark from "@/components/BlogPostBookmark";
import BlogPostComment from "@/components/BlogPostComment";
import BlogPostLike from "@/components/BlogPostLike";
import Codeblock from "@/components/Codeblock";
import Confetti from "@/components/Confetti";
import FollowUserButton from "@/components/FollowUserButton";
import ObserverWrapper from "@/components/ObserverWrapper";
import ShareBlogModal from "@/components/ShareBlogModal";
import UserBlogsSkeletons from "@/components/skeletons/UserBlogsSkeletons";
import { colors } from "@/constants/colors";
import { Blog, User } from "@/types/schemaTypes";
import {
  checkIsFollowing,
  fetchBlogViews,
  fetchSingleBlog,
  fetchSingleUser,
  fetchUserBlogs,
} from "@/utils/fetchActions";
import { capitalize, formatDate, readingTime } from "@/utils/helpers";
import edjsHTML from "editorjs-html";
import "highlight.js/styles/github.css";
import parse from "html-react-parser";
import { Metadata, Viewport } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { LuEye } from "react-icons/lu";
import { v4 as uuid } from "uuid";
import styles from "./styles.module.css";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const generateViewport = async ({
  params,
}: {
  params: { username: string; blog: string };
}): Promise<Viewport> => {
  const blog: Blog = await fetchSingleBlog(params.blog);
  if (!blog) {
    return notFound();
  }

  return {
    themeColor: blog.categories[0]?.color,
  };
};

export const generateMetadata = async ({
  params,
}: {
  params: { username: string; blog: string };
}): Promise<Metadata> => {
  const blog: Blog = await fetchSingleBlog(params.blog);
  if (!blog) {
    return notFound();
  }

  return {
    title: blog.title,
    description: blog.description,
    openGraph: {
      images: [{ url: blog.thumbnail || "" }],
    },
  };
};

const MoreFromAuthor = async ({
  username,
  currentBlog,
}: {
  username: string;
  currentBlog: string;
}) => {
  const res: Blog[] = await fetchUserBlogs(username, 4);
  const moreBlogs = res.filter((blog) => blog.slug !== currentBlog);

  if (moreBlogs.length === 4) moreBlogs.pop();

  if (moreBlogs.length === 0) return;
  return (
    <div className="container max-w-screen-md space-y-6">
      <h2 className="text-center text-xl font-semibold">
        More from {moreBlogs[0].author.fullname}
      </h2>
      {moreBlogs.map((blog, i: number) => {
        return <BlogArticleCard key={blog.id} blog={blog} />;
      })}
    </div>
  );
};

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

  if (!blog.isPublished && !isSameUser) {
    return notFound();
  }
  const { isFollowing } =
    session && !isSameUser
      ? await checkIsFollowing(session.user.username, blog.author.username)
      : { isFollowing: false };
  const html = edjsParser.parse(blog.content as any);
  const { views } = await fetchBlogViews(blog.slug);

  return (
    <>
      <Confetti />
      <ObserverWrapper>
        <section
          className={
            "relative -mt-14 flex h-[25rem] flex-col items-center gap-4 bg-blue-400  py-20 text-white before:absolute before:left-0  before:top-0 before:h-full before:w-full before:bg-white/30 sm:-mt-24 sm:h-[28rem] md:h-[35rem] lg:h-[42rem] lg:gap-10"
          }
          style={{
            backgroundColor:
              blog.categories[0]?.color ||
              colors[Number((Math.random() * 10).toFixed(0))],
          }}
        >
          <div className="relative z-10  font-medium sm:mt-4">
            {blog.categories.length
              ? capitalize(blog.categories[0].name) + " • "
              : ""}
            {readingTime(blog.length)} mins
          </div>
          <h1 className="relative z-10 mx-auto  px-4 text-center text-xl font-bold leading-tight sm:container  md:text-3xl lg:max-w-4xl">
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
              <div className="font-semibold">
                <Link
                  className="hover:underline"
                  href={`/@${blog.author.username}`}
                >
                  {blog.author.fullname}
                </Link>
              </div>
              <div className="text-sm text-white/80">
                {blog.isPublished
                  ? formatDate(blog.createdAt)
                  : "Saved as draft"}
              </div>
            </div>
          </div>
          <div className="relative z-10 flex gap-4">
            <div className="flex items-center gap-1">
              <LuEye className="text-xl" />
              <p>{views}</p>
            </div>
            <BlogPostLike blog={blog} user={user} />
            <BlogPostComment session={session} slug={blog.slug} />
            <BlogPostBookmark blog={blog} user={user} />
            <ShareBlogModal
              iconOnly
              iconsize={18}
              url={`${BASE_URL}/@${blog.author.username}/${blog.slug}`}
              className="px-0 hover:bg-transparent"
            />
          </div>
        </section>
      </ObserverWrapper>

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

      <section className="mx-6 my-20 flex items-center justify-between gap-2 border-y py-8 lg:container sm:mx-auto  sm:max-w-lg sm:gap-6 sm:px-6 lg:max-w-3xl   lg:gap-10">
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
            <div className="text-lg font-semibold hover:underline">
              <Link href={`/@${blog.author.username}`}>
                {blog.author.fullname}
              </Link>
            </div>
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

      <section className=" mx-auto  max-w-screen-md">
        <Suspense fallback={<UserBlogsSkeletons />}>
          <MoreFromAuthor
            username={blog.author.username}
            currentBlog={blog.slug}
          />
        </Suspense>
      </section>
    </>
  );
};

export default page;
