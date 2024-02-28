import client from "@/lib/prisma";
import apiErrorHandler from "@/utils/apiErrorHandler";
import { Session, getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

const hasViewed = async (
  session: Session | null,
  slug: string,
  ip: string | null
) => {
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
    if (!ip) {
      return true;
    }
    const view = await client.bLogView.findFirst({
      where: {
        userIP: ip,
        blog: {
          slug,
        },
      },
    });
    return !!view;
  }
};

const increaseViews = async (
  session: Session | null,
  slug: string,
  ip: string
) => {
  if (session) {
    const viewWithIP = await client.bLogView.findFirst({
      where: {
        userIP: ip,
        blog: {
          slug,
        },
      },
    });

    if (viewWithIP && !viewWithIP.userID) {
      await client.bLogView.update({
        where: {
          id: viewWithIP.id,
        },
        data: {
          user: {
            connect: {
              username: session.user.username,
            },
          },
        },
      });
    } else {
      await client.bLogView.create({
        data: {
          user: {
            connect: {
              username: session.user.username,
            },
          },
          blog: {
            connect: {
              slug,
            },
          },
          userIP: ip,
        },
      });
    }
  } else {
    await client.bLogView.create({
      data: {
        blog: {
          connect: {
            slug,
          },
        },
        userIP: ip,
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
        isPublished: true,
      },
      include: {
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
              },
            },
          },
        },
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

      const hasAlreadyViewed = await hasViewed(session, blog.slug, userIP);

      if (!hasAlreadyViewed && userIP) {
        await increaseViews(session, blog.slug, userIP);
      }

      const { savedBy, Like, ...restBlog } = blog;
      return NextResponse.json(
        { ...restBlog, isBookmarked, isLiked },
        { status: 200 }
      );
    }

    return NextResponse.json(blog, { status: 200 });
  }
);
