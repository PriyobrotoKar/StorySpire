import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiErrorHandler(
  async (req: NextRequest, { params }: { params: { username: string } }) => {
    const limit = req.nextUrl.searchParams.get("limit") ?? 0;
    const user = await client.user.findUnique({
      where: {
        username: params.username,
      },
    });
    if (!user) {
      throw new ApiError(
        "Invalid Params",
        {
          title: "Username Invalid",
          description: "This username does not exists",
        },
        404
      );
    }

    const blogs = await client.blog.findMany({
      where: {
        author: {
          username: user.username,
        },
        isPublished: true,
      },
      orderBy: {
        BLogView: {
          _count: "desc",
        },
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
      ...(limit && { take: Number(limit) }),
    });

    return NextResponse.json(blogs, { status: 200 });
  }
);
