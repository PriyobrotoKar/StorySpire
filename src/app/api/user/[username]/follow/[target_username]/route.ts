import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { User } from "@prisma/client";
import { NextResponse } from "next/server";

export const GET = apiErrorHandler(
  async (
    req: Request,
    {
      params: { username: source_username, target_username },
    }: { params: { username: string; target_username: string } }
  ) => {
    const users = await client.user.findMany({
      where: {
        OR: [
          {
            username: source_username,
          },
          {
            username: target_username,
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
      (value) => value.username === source_username
    ) as User;
    const other_user = users.find(
      (value) => value.username === target_username
    ) as User;

    const existFollow = await client.follow.findUnique({
      where: {
        followerID_followingID: {
          followerID: self_user.id,
          followingID: other_user.id,
        },
      },
    });

    return NextResponse.json({ isFollowing: !!existFollow }, { status: 200 });
  }
);
