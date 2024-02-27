import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiErrorHandler(
  async (req: NextRequest, { params }: { params: { slug: string } }) => {
    const blog = await client.blog.findUnique({
      where: {
        slug: params.slug,
        isPublished: false,
      },
      include: {
        author: {
          include: { _count: { select: { follower: true, blogs: true } } },
        },
      },
    });

    if (!blog) {
      return new ApiError(
        "Invalid Params",
        { title: "Invalid Slug", description: "No blog exists with this slug" },
        400
      );
    }

    return NextResponse.json(blog, { status: 200 });
  }
);
