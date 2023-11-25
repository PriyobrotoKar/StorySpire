import { fetchSingleUser, fetchUserBlogs } from "@/utils/fetchActions";
import React from "react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { authOptions } from "../api/auth/[...nextauth]/options";
import AddLinkBtn from "@/components/AddLinkBtn";
import UserPostNav from "@/components/UserPostNav";
import { capitalize, formatDate, readingTime } from "@/utils/helpers";
import { Blog } from "@/types/schemaTypes";
import Link from "next/link";
import "../globals.css";

const user = async ({ params }: { params: { username: string } }) => {
  const session = await getServerSession(authOptions);
  let { username } = params;

  if (!username.includes("%40")) {
    return notFound();
  }
  username = username.slice(3);
  const user = await fetchSingleUser(username);
  if (!user) {
    return notFound();
  }

  const blogs = await fetchUserBlogs(username);

  return (
    <div>
      <section className="h-[16rem] bg-muted-foreground/20">
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
      <div className="-translate-y-2  rounded-t-md bg-background ">
        <div className="mx-auto flex flex-col  sm:container lg:flex-row">
          <section className="relative z-10 flex-1 px-4 py-12 lg:py-20">
            <div>
              <Image
                src={user.profile_pic || "/images/avatarFallback.png"}
                alt="user profile picture"
                width={85}
                height={85}
                className="absolute -top-12 rounded-full border-[4px] border-white shadow-lg lg:-top-16 lg:h-32 lg:w-32"
              />
            </div>
            {session?.user.username === user.username && (
              <Button
                variant={"outline"}
                className="absolute right-6 top-6 lg:top-12"
              >
                Edit
              </Button>
            )}
            <div className="space-y-4">
              <div>
                <h1 className="text-xl font-bold text-secondary-foreground">
                  {user.fullname}
                </h1>
                <p className="font-medium text-muted-foreground">
                  @{user.username}
                </p>
              </div>
              <div>{/*Followers */}</div>
              <p className="text-sm text-muted-foreground">{user.bio}</p>
              <AddLinkBtn />
              {user.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <HiOutlineLocationMarker />
                  <p>{user.location}</p>
                </div>
              )}
              <div className="flex items-center justify-between gap-4 rounded-md border p-4">
                <div className="text-sm font-medium">
                  Follow to get new updates in your activity feed or start page
                </div>
                <Button>Follow</Button>
              </div>
            </div>
          </section>
          <section className="flex-[2_1_0%] space-y-6 px-4 lg:py-12">
            <UserPostNav />
            {blogs.map((blog: Blog, i: number) => {
              return (
                <>
                  <article key={blog.id} className="space-y-4">
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
                      <Link href={`/@${blog.author.username}/${blog.slug}`}>
                        <div className="flex flex-col gap-3 sm:flex-row-reverse">
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
                            <div className="space-y-1">
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
                  {i !== blogs.length - 1 && <hr />}
                </>
              );
            })}
          </section>
        </div>
      </div>
    </div>
  );
};

export default user;
