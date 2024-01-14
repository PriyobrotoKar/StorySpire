import client from "@/lib/prisma";
import apiErrorHandler from "@/utils/apiErrorHandler";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiErrorHandler(async (req: NextRequest) => {
  const offset = req.nextUrl.searchParams.get("offset") ?? 0;
  const postCount = req.nextUrl.searchParams.get("post_count") ?? 0;
  const limit = Number(postCount) === 0 ? 20 : 10;
  const categoriesCount = await client.category.aggregate({
    _count: true,
  });
  const categories = await client.category.findMany({
    orderBy: {
      posts: {
        _count: "desc",
      },
    },

    skip: Number(offset),
    take: limit,
    include: {
      posts: {
        orderBy: {
          createdAt: "desc",
        },
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
      },
      _count: {
        select: {
          posts: true,
        },
      },
    },
  });

  return NextResponse.json({ categories, ...categoriesCount }, { status: 200 });
});
