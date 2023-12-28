import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import client from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = apiErrorHandler(
  async (request: Request, { params }: { params: { slug: string } }) => {
    const session = await getServerSession(authOptions);
    const blog = await client.blog.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        categories: {
          orderBy: {
            createdAt: "desc",
          },
        },
        author: true,
        savedBy: {
          where: {
            username: session ? session.user.username : "",
          },
          select: {
            id: true,
          },
        },
        Like: {
          where: {
            likedBy: {
              username: session ? session.user.username : "",
            },
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            Like: true,
          },
        },
      },
    });
    if (blog) {
      const isBookmarked = blog && blog.savedBy.length > 0;
      const isLiked = blog && blog.Like.length > 0;
      const { savedBy, Like, ...restBlog } = blog;
      return NextResponse.json(
        { ...restBlog, isBookmarked, isLiked },
        { status: 200 }
      );
    }

    return NextResponse.json(blog, { status: 200 });
  }
);
