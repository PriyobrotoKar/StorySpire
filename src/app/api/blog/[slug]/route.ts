import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { deleteFromCloud } from "@/utils/deleteFromCloudinary";
import { Prisma } from "@prisma/client";
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

export const DELETE = apiErrorHandler(
  async (request: NextRequest, { params }: { params: { slug: string } }) => {
    const session = await getServerSession(authOptions);
    if (!session)
      throw new ApiError(
        "Not Authorized",
        { title: "Unauthorized", description: "Please login" },
        401
      );

    //check if the user is deleting his own blog
    const blog = await client.blog.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        author: true,
      },
    });

    if (!blog) {
      throw new ApiError(
        "Invalid Params",
        { title: "Invalid Slug", description: "No blog found with this slug" },
        400
      );
    }

    if (blog.author.username !== session.user.username) {
      throw new ApiError(
        "Unauthorized",
        {
          title: "Not Alllowed",
          description: "You can only delete your own blogs",
        },
        400
      );
    }
    //start deleting blog post
    //delete the images of the blog from cloud
    //delete the thumbnail of the blog
    if (blog.thumbnail) {
      await deleteFromCloud(blog.thumbnail);
    }
    //delete the images in the blog
    const content = blog.content as Prisma.JsonObject;
    if (Array.isArray(content.blocks)) {
      const blocks = content.blocks as Prisma.JsonArray;
      blocks.forEach((element) => {
        if (element && typeof element === "object" && !Array.isArray(element)) {
          const block = element as Prisma.JsonObject;

          if (block["type"] === "image") {
            const data = block.data as any;
            deleteFromCloud(data.file.url);
          }
        }
      });
    }
    //delete the blog record from data base
    await client.$transaction([
      client.blog.update({
        where: {
          id: blog.id,
        },
        data: {
          categories: { set: [] },
          savedBy:{set:[]}
        },
      }),
      client.blog.delete({
        where: {
          id: blog.id,
        },
      }),
    ]);

    return NextResponse.json("Blog Deleted Successfully", { status: 200 });
  }
);
