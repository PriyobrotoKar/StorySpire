import { fetchSingleUser } from "@/utils/fetchActions";
import React from "react";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { authOptions } from "../api/auth/[...nextauth]/options";
import AddLinkBtn from "@/components/AddLinkBtn";

const user = async ({ params }: { params: { username: string } }) => {
  const session = await getServerSession(authOptions);
  console.log(session);
  const { username } = params;

  if (!username.includes("%40")) {
    return notFound();
  }

  const user = await fetchSingleUser(username.slice(3));
  if (!user) {
    return notFound();
  }

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
      <section className="relative z-10 -translate-y-2 rounded-t-md bg-background px-4 py-12">
        <div>
          <Image
            src={user.profile_pic || "/images/avatarFallback.png"}
            alt="user profile picture"
            width={85}
            height={85}
            className="absolute -top-12 rounded-full border-[4px] border-white shadow-lg"
          />
        </div>
        {session?.user.username === user.username && (
          <Button variant={"outline"} className="absolute right-6 top-6">
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
    </div>
  );
};

export default user;
