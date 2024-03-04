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
      select: {
        follower: true,
      },
      take: 10,
    });

    return NextResponse.json(followers, { status: 200 });
  }
);
