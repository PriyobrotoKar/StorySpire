import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export const GET = apiErrorHandler(async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(
      "Unauthorized",
      { title: "Not Authorized", description: "Please Login" },
      401
    );
  }

  const bookmarkedBlogs = await client.blog.findMany({
    where: {
      savedBy: {
        some: {
          username: session.user.username,
        },
      },
    },
    select: {
      title: true,
      thumbnail: true,
      description: true,
      id: true,
      length: true,
      slug: true,
      isPublished: true,
      categories: {
        orderBy: {
          createdAt: "desc",
        },
      },
      author: {
        include: {
          _count: {
            select: {
              follower: true,
              blogs: true,
            },
          },
        },
      },
      createdAt: true,
    },
  });

  return NextResponse.json(bookmarkedBlogs, { status: 200 });
});
