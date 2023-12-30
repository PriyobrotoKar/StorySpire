import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { User } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = apiErrorHandler(
  async (
    req: Request,
    { params: { username: target_user } }: { params: { username: string } }
  ) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError(
        "Unauthorized",
        { title: "Not Authorized", message: "Please Login" },
        401
      );
    }

    const users = await client.user.findMany({
      where: {
        OR: [
          {
            username: session.user.username,
          },
          {
            username: target_user,
          },
        ],
      },
    });

    if (users.length != 2) {
      throw new ApiError(
        "Invalid Params",
        {
          title: "Username invalid",
          description: "Please provide valid usernames",
        },
        400
      );
    }

    const self_user = users.find(
      (value) => value.username === session.user.username
    ) as User;
    const other_user = users.find(
      (value) => value.username === target_user
    ) as User;

    console.log(self_user.username, other_user.username);

    const followStatus = await client.follow.findUnique({
      where: {
        followerID_followingID: {
          followerID: self_user.id,
          followingID: other_user.id,
        },
      },
    });

    if (followStatus) {
      throw new ApiError(
        "Bad Reqeust",
        {
          title: "Can't follow this user",
          description: "his user has already been followed",
        },
        400
      );
    }

    const follow = await client.follow.create({
      data: {
        followerID: self_user.id,
        followingID: other_user.id,
      },
    });

    return NextResponse.json("Successfully Followed User", { status: 200 });
  }
);
export const DELETE = apiErrorHandler(
  async (
    req: Request,
    { params: { username: target_user } }: { params: { username: string } }
  ) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError(
        "Unauthorized",
        { title: "Not Authorized", message: "Please Login" },
        401
      );
    }

    const users = await client.user.findMany({
      where: {
        OR: [
          {
            username: session.user.username,
          },
          {
            username: target_user,
          },
        ],
      },
    });

    if (users.length != 2) {
      throw new ApiError(
        "Invalid Params",
        {
          title: "Username invalid",
          description: "Please provide valid usernames",
        },
        400
      );
    }

    const self_user = users.find(
      (value) => value.username === session.user.username
    ) as User;
    const other_user = users.find(
      (value) => value.username === target_user
    ) as User;

    const followStatus = await client.follow.findUnique({
      where: {
        followerID_followingID: {
          followerID: self_user.id,
          followingID: other_user.id,
        },
      },
    });

    if (!followStatus) {
      throw new ApiError(
        "Bad Reqeust",
        {
          title: "Can't unfollow this user",
          description: "his user has already been unfollowed",
        },
        400
      );
    }

    const unfollow = await client.follow.delete({
      where: {
        followerID_followingID: {
          followerID: self_user.id,
          followingID: other_user.id,
        },
      },
    });

    return NextResponse.json("Successfully Unfollowed User", { status: 200 });
  }
);
