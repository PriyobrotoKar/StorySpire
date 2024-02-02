import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiErrorHandler(async (req: NextRequest) => {
  //   const session = await getServerSession(authOptions);
  const query = req.nextUrl.searchParams.get("q");
  const offset = req.nextUrl.searchParams.get("offset") ?? 0;
  const postCount = req.nextUrl.searchParams.get("post_count") ?? 10;

  if (!query) {
    throw new ApiError(
      "Invalid Query",
      { title: "No query provided", description: "Please enter a valid query" },
      400
    );
  }

  const dbQuery: Prisma.BlogWhereInput | undefined = {
    OR: [
      {
        title: {
          startsWith: query,
          mode: "insensitive",
        },
      },
      {
        title: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        description: {
          startsWith: query,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: query,
          mode: "insensitive",
        },
      },
      {
        author: {
          fullname: {
            startsWith: query,
            mode: "insensitive",
          },
        },
      },
      {
        author: {
          username: query,
        },
      },
    ],
  };

  const blogsPromise = client.blog.findMany({
    where: dbQuery,
    select: {
      title: true,
      thumbnail: true,
      description: true,
      id: true,
      length: true,
      slug: true,
      categories: {
        orderBy: {
          createdAt: "desc",
        },
      },
      author: {
        include: { _count: { select: { follower: true, blogs: true } } },
      },
      createdAt: true,
    },
    take: Number(postCount),
    skip: Number(offset),
  });
  const countPromise = client.blog.count({
    where: dbQuery,
  });

  const [blogs, resultCount] = await Promise.all([blogsPromise, countPromise]);

  return NextResponse.json({ blogs, _count: resultCount }, { status: 200 });
});
