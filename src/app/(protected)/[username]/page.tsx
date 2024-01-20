import {
  checkIsFollowing,
  fetchFollowers,
  fetchSingleUser,
  fetchUserBlogs,
  sleep,
} from "@/utils/fetchActions";
import React, { Suspense } from "react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HiOutlineLocationMarker } from "react-icons/hi";
import AddLinkBtn from "@/components/AddLinkBtn";
import UserPostNav from "@/components/TabGroup";
import { capitalize, formatDate, readingTime } from "@/utils/helpers";
import { Blog, User } from "@/types/schemaTypes";
import Link from "next/link";
import Socials from "@/components/Socials";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import BlogArticleCard from "@/components/BlogArticleCard";
import FollowUserButton from "@/components/FollowUserButton";
import UserFollowerCount from "@/components/UserFollowerCount";
import TabGroup from "@/components/TabGroup";
import UserBlogsSkeletons from "@/components/skeletons/UserBlogsSkeletons";

const UserBlogs = async ({
  username,
  user,
}: {
  username: string;
  user: User;
}) => {
  const blogs = await fetchUserBlogs(username);
  return (
    <>
      {!blogs.length && (
        <p className="my-32 text-center text-sm text-muted-foreground">
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

const user = async ({ params }: { params: { username: string } }) => {
  await sleep(2000);
  const session = await getServerSession(authOptions);
  let { username } = params;

  if (!username.includes("%40")) {
    return notFound();
  }
  username = username.slice(3);
  const tabs = [
    { id: "recent", label: "Recent", link: `/@${username}` },
    { id: "popular", label: "Popular", link: `/@${username}/` },
    { id: "about", label: "About", link: `/@${username}/` },
  ];
  const user: User = await fetchSingleUser(username);
  if (!user) {
    return notFound();
  }
  const isSameUser = session?.user.username === user.username;

  const { isFollowing } =
    session && !isSameUser
      ? await checkIsFollowing(session.user.username, username)
      : { isFollowing: false };

  return (
    <div className="flex min-h-[inherit] flex-col sm:-mt-32">
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
                src={user.profile_pic || "/images/avatarFallback.png"}
                alt="user profile picture"
                width={150}
                height={150}
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
            <Suspense fallback={<UserBlogsSkeletons />}>
              <UserBlogs user={user} username={username} />
            </Suspense>
          </section>
        </div>
      </div>
    </div>
  );
};

export default user;
