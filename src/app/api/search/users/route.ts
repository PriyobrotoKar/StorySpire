import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export const GET = apiErrorHandler(async (req: NextRequest) => {
  // const session = await getServerSession(authOptions);
  const query = req.nextUrl.searchParams.get("q");
  const offset = req.nextUrl.searchParams.get("offset") ?? 0;
  const userCount = req.nextUrl.searchParams.get("user_count") ?? 10;
  const session = await getServerSession(authOptions);

  if (!query) {
    throw new ApiError(
      "Invalid Query",
      { title: "No query provided", description: "Please enter a valid query" },
      400
    );
  }

  const dbQuery: Prisma.UserWhereInput | undefined = {
    OR: [
      {
        username: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        fullname: {
          contains: query,
          mode: "insensitive",
        },
      },
    ],
    ...(session && {
      username: {
        not: session.user.username,
      },
    }),
  };

  const users = await client.user.findMany({
    where: dbQuery,
    select: {
      id: true,
      fullname: true,
      username: true,
      bio: true,
      profile_pic: true,
      _count: {
        select: {
          follower: true,
        },
      },
    },
    take: Number(userCount),
    skip: Number(offset),
  });

  const resultCount = await client.user.count({
    where: dbQuery,
  });

  return NextResponse.json({ users, _count: resultCount }, { status: 200 });
});
