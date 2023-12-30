import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { NextResponse } from "next/server";

export const GET = apiErrorHandler(
  async (req: Request, { params }: { params: { username: string } }) => {
    const userExists = await client.user.findUnique({
      where: {
        username: params.username,
      },
    });

    if (!userExists) {
      throw new ApiError(
        "Invalid Params",
        {
          title: "This user does not exists",
          description: "Please enter a valid username",
        },
        400
      );
    }

    const followers = await client.follow.findMany({
      where: {
        following: {
          username: params.username,
        },
      },
      take: 10,
    });
    const followersCount = await client.follow.count({
      where: {
        following: {
          username: params.username,
        },
      },
    });

    return NextResponse.json(
      { _count: followersCount, followers },
      { status: 200 }
    );
  }
);
