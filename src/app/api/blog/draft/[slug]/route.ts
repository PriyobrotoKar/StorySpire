import client from "@/lib/prisma";
import apiErrorHandler from "@/utils/apiErrorHandler";
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

    return NextResponse.json(blog, { status: 200 });
  }
);
