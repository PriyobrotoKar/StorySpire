import client from "@/lib/prisma";
import apiErrorHandler from "@/utils/apiErrorHandler";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiErrorHandler(async (request: NextRequest) => {
  const params = request.nextUrl.searchParams;
  const limit = Number(params.get("limit"));
  const recent = await client.blog.findMany({
    where: {
      isPublished: true,
      isFeatured: false,
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
      isPublished: true,
    },
    take: limit || 5,
    orderBy: {
      createdAt: "desc",
    },
  });
  return NextResponse.json(recent, { status: 200 });
});
