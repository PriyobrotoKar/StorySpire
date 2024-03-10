import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const POST = apiErrorHandler(
  async (req: Request, { params }: { params: { slug: string } }) => {
    const body = await req.json();
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError(
        "Unauthorized",
        { title: "Not Authorized", message: "Please Login" },
        401
      );
    }

    const post = await client.blog.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!post) {
      throw new ApiError(
        "Not Found",
        { title: "Invalid params", description: "Please enter a valid slug" },
        404
      );
    }

    const comment = await client.comment.create({
      data: {
        comment: body.comment,
        commentedBy: {
          connect: {
            username: session.user.username,
          },
        },
        post: {
          connect: {
            id: post.id,
          },
        },
      },
      include: {
        commentedBy: {
          include: { _count: { select: { follower: true, blogs: true } } },
        },
      },
    });

    return NextResponse.json(comment, { status: 200 });
  }
);

export const GET = apiErrorHandler(
  async (req: Request, { params }: { params: { slug: string } }) => {
    const blog = await client.blog.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!blog) {
      throw new ApiError(
        "Not Found",
        {
          title: "Invalid params",
          description: "Please enter a valid slug",
        },
        404
      );
    }

    const commentsCount = await client.comment.count({
      where: {
        postID: blog.id,
      },
    });

    const comments = await client.comment.findMany({
      where: {
        post: {
          id: blog.id,
        },
      },
      include: {
        commentedBy: {
          include: { _count: { select: { follower: true, blogs: true } } },
        },
      },
    });

    return NextResponse.json(
      { comments, _count: commentsCount },
      { status: 200 }
    );
  }
);
