import client from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import apiErrorHandler from "../../../../utils/apiErrorHandler";

export const GET = apiErrorHandler(async (req: NextRequest) => {
  const limit = req.nextUrl.searchParams.get("limit") ?? 5;
  const user = await client.user.findMany({
    select: {
      username: true,
      fullname: true,
      email: true,
      profile_pic: true,
      _count: {
        select: {
          follower: true,
          blogs: true,
        },
      },
    },
    orderBy: [
      {
        follower: {
          _count: "desc",
        },
      },
      { createdAt: "desc" },
    ],
    take: Number(limit),
  });
  return NextResponse.json(user, { status: 200 });
});
