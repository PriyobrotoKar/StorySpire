import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import client from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const hasViewed = async (session: Session | null, slug: string, ip: string) => {
  if (session) {
    const view = await client.bLogView.findFirst({
      where: {
        user: {
          username: session.user.username,
        },
        blog: {
          slug,
        },
      },
    });

    return !!view;
  } else {
    const view = await client.bLogView.findFirst({
      where: {
        userIP: ip,
        blog: {
          slug,
        },
      },
    });
  }
};

export const GET = apiErrorHandler(
  async (request: NextRequest, { params }: { params: { slug: string } }) => {
    const session = await getServerSession(authOptions);
    const userIP = request.ip ?? request.headers.get("X-Forwarded-For");

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
