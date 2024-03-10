import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import BlogArticleCard from "@/components/BlogArticleCard";
import FollowUserButton from "@/components/FollowUserButton";
import Socials from "@/components/Socials";
import TabGroup from "@/components/TabGroup";
import UserFollowerCount from "@/components/UserFollowerCount";
import UserBlogsSkeletons from "@/components/skeletons/UserBlogsSkeletons";
import { Button } from "@/components/ui/button";
import { Blog, User } from "@/types/schemaTypes";
import {
  checkIsFollowing,
  fetchSingleUser,
  fetchUserBlogs,
  fetchUserDrafts,
  fetchUserPopularBlogs,
} from "@/utils/fetchActions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { v4 } from "uuid";

export const generateMetadata = async ({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> => {
  let { username } = params;

  if (!username.includes("%40")) {
    return notFound();
  }
  username = username.slice(3);
  const user: User = await fetchSingleUser(username);
  return {
    title: user.fullname,
    description: user.bio,
    twitter: {
      card: "summary",
    },
    openGraph: {
      images: [
        {
          url: user.profile_pic || "",
        },
      ],
    },
  };
};

const UserBlogs = async ({
  username,
  user,
  tab,
}: {
  username: string;
  user: User;
  tab: "drafts" | undefined;
}) => {
  let blogs;
  if (tab === "drafts") {
    blogs = await fetchUserDrafts(username);
  } else if (tab === "popular") {
    blogs = await fetchUserPopularBlogs(username);
  } else {
    blogs = await fetchUserBlogs(username);
  }
  return (
    <>
      {!blogs.length && (
        <p className="py-32 text-center text-sm text-muted-foreground">
          {user.fullname} hasn&apos;t written any blogs yet.
        </p>
      )}
      {blogs.map((blog: Blog, i: number) => {
        return (
          <div key={blog.id} className="space-y-6">
            <BlogArticleCard showAuthor={false} blog={blog} />
            {i !== blogs.length - 1 && <hr />}
          </div>
        );
      })}
    </>
  );
};

const user = async ({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams: { tab: "drafts" | undefined };
}) => {
  const session = await getServerSession(authOptions);

  let { username } = params;

  if (!username.includes("%40")) {
    return notFound();
  }
  username = username.slice(3);
  const user: User = await fetchSingleUser(username);
  if (!user) {
    return notFound();
  }
  const isSameUser = session?.user.username === user.username;
  const tabs = [
    { id: "recent", label: "Recent", link: `/@${username}` },
    { id: "popular", label: "Popular", link: `/@${username}?tab=popular` },
    ...(isSameUser
      ? [{ id: "draft", label: "Draft", link: `/@${username}?tab=drafts` }]
      : []),
  ];

  let profilePicHighQuality: string | null;
  if (
    user.profile_pic &&
    new URL(user.profile_pic).hostname === "lh3.googleusercontent.com"
  ) {
    const profilePicPath = user.profile_pic?.split("");
    profilePicPath?.splice(profilePicPath.indexOf("=") + 1, 3, "s150");
    profilePicHighQuality = profilePicPath.join("");
  } else {
    profilePicHighQuality = user.profile_pic;
  }

  const { isFollowing } =
    session && !isSameUser
      ? await checkIsFollowing(session.user.username, username)
      : { isFollowing: false };

  return (
    <div className="-mt-14 flex min-h-[inherit] flex-col sm:-mt-24">
      <section className="lg:mih-h-[20rem] h-[16rem] bg-muted-foreground/20 lg:h-[40svh] ">
        {user.cover_pic && (
          <Image
            src={user.cover_pic}
            alt="cover picture"
            width={1500}
            height={500}
            className="h-full w-full object-cover"
          />
        )}
      </section>
      <div className="flex-grow -translate-y-3  rounded-t-2xl bg-background  shadow-[0_-70px_60px_-40px] shadow-black/20">
        <div className="mx-auto flex flex-col  sm:container lg:flex-row">
          <section className="top-20 z-10 flex-1 self-start px-4 py-16 lg:sticky lg:py-20">
            <div className="absolute -top-10 h-24 w-24 overflow-hidden rounded-full border-[4px] border-white shadow-lg lg:-top-16 lg:h-32 lg:w-32">
              <Image
                src={profilePicHighQuality || "/images/avatarFallback.png"}
                alt="user profile picture"
                width={200}
                height={200}
                priority
                className="h-full w-full object-cover"
              />
            </div>
            {session?.user.username === user.username && (
              <Link href={"/account/profile"}>
                <Button
                  variant={"outline"}
                  className="absolute right-6 top-6 lg:top-12"
                >
                  Edit
                </Button>
              </Link>
            )}
            <div className="space-y-3">
              <div>
                <h1 className="text-xl font-bold text-secondary-foreground">
                  {user.fullname}
                </h1>
                <p className="font-medium text-muted-foreground">
                  @{user.username}
                </p>
              </div>
              <UserFollowerCount followerCount={user._count.follower} />
              <p className="text-md leading-snug text-muted-foreground">
                {user.bio}
              </p>
              {user.location && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <HiOutlineLocationMarker />
                  <p>{user.location}</p>
                </div>
              )}
              <Socials
                user={user}
                socials={user.socials}
                isSameUser={isSameUser}
              />
              <FollowUserButton
                isSameUser={isSameUser}
                isFollowing={isFollowing}
                targetUsername={user.username}
                followerCount={user._count.follower}
              />
            </div>
          </section>
          <section className="flex-[2_1_0%]  space-y-6 px-4 lg:py-12">
            <div className="border-b py-2">
              <TabGroup tabs={tabs} />
            </div>
            <Suspense key={v4()} fallback={<UserBlogsSkeletons key={v4()} />}>
              <UserBlogs
                user={user}
                username={username}
                tab={searchParams.tab}
              />
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  );
};

export default user;
