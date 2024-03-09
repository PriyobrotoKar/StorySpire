import BlogArticleCard from "@/components/BlogArticleCard";
import SearchBar from "@/components/SearchBar";
import BlogPostGridSkeleton from "@/components/skeletons/BlogPostGridSkeleton";
import FeaturedSkeletons from "@/components/skeletons/FeaturedSkeletons";
import { cn } from "@/lib/utils";
import { Blog, User } from "@/types/schemaTypes";
import {
  fetchFeaturedBlogs,
  fetchRecentBlogs,
  getTopWriters,
} from "@/utils/fetchActions";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { authOptions } from "../api/auth/[...nextauth]/options";

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

const LeaderboardBestWriter = ({
  writer,
  position,
}: {
  writer: User & { _count: { blogs: true } };
  position: "1st" | "2nd" | "3rd";
}) => {
  return (
    <div className="relative z-10 w-[25%] space-y-2 sm:w-[20%]">
      <div className="text-center text-primary-foreground">
        <Link className="mx-auto block w-fit" href={`/@${writer.username}`}>
          <div className="h-12 w-12 overflow-hidden rounded-full outline outline-0 outline-border transition-all  hover:scale-125 hover:outline-4">
            <Image
              src={writer.profile_pic || "/images/avatarFallback.png"}
              alt="second"
              className="h-full w-full object-cover"
              width={64}
              height={64}
            />
          </div>
        </Link>
        <span className="text-md font-medium ">
          {writer.fullname.split(" ")[0]}
        </span>
      </div>
      <div
        className={cn(
          "flex  flex-col items-center justify-center rounded-t-md border border-border  text-secondary-foreground shadow-[inset_0px_-18px_25px_5px_#00000036]",
          { "h-44 bg-green-300": position === "2nd" },
          { "h-52 bg-primary": position === "1st" },
          { "h-32 bg-yellow-200": position === "3rd" }
        )}
      >
        <div className="font-semibold">
          <span className="text-2xl font-bold">{position[0]}</span>
          {position.slice(1)}
        </div>
        <div className="hidden text-sm font-semibold text-accent-foreground/70 sm:block ">
          <span className=" text-md">{writer._count.follower}</span> Followers
        </div>
        <div className="hidden text-sm font-semibold text-accent-foreground/70 sm:block">
          <span className=" text-md ">{writer._count.blogs} </span>
          Articles
        </div>
      </div>
    </div>
  );
};

const TopWriters = async () => {
  const session = await getServerSession(authOptions);
  const writers: (User & { _count: { blogs: true } })[] =
    await getTopWriters(8);
  const [first, second, third, ...leaderboard] = writers.map((writer) => {
    return {
      ...writer,
      fullname:
        writer.username === session?.user.username ? "You" : writer.fullname,
    };
  });
  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      <div className="relative flex flex-1 items-end justify-center gap-6 rounded-lg bg-secondary-foreground pt-16">
        <div className="absolute h-full w-full bg-[radial-gradient(#e5e7eb60_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_20%,#000_20%,transparent_150%)]"></div>

        <LeaderboardBestWriter writer={second} position={"2nd"} />
        <LeaderboardBestWriter writer={first} position={"1st"} />
        <LeaderboardBestWriter writer={third} position={"3rd"} />
      </div>
      <div className="flex-1 space-y-2">
        {leaderboard.map((writer, i) => {
          return (
            <Link
              href={`/@${writer.username}`}
              key={writer.id}
              className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-secondary sm:gap-6 sm:px-4 sm:py-3"
            >
              <div className="font-semibold">{i + 4}</div>
              <div className="flex flex-1 items-center gap-2 overflow-hidden">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
                  <Image
                    src={writer.profile_pic || "/images/avatarFallback.png"}
                    alt="second"
                    className="h-full w-full object-cover"
                    width={64}
                    height={64}
                  />
                </div>
                <div className="overflow-hidden">
                  <div className="text-sm font-semibold sm:text-md">
                    {writer.fullname}
                  </div>
                  <div className="truncate text-sm font-medium text-muted-foreground">
                    @{writer.username}
                  </div>
                </div>
              </div>
              <div>
                <div className="text-center font-medium">
                  {writer._count.blogs}
                </div>
                <div className="text-sm text-muted-foreground">Aritcles</div>
              </div>
              <div>
                <div className="text-center font-medium">
                  {writer._count.follower}
                </div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
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

        <SearchBar />
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
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Top Writers</h2>
          <Suspense fallback={"Loading..."}>
            <TopWriters />
          </Suspense>
        </section>
      </div>
    </div>
  );
}
