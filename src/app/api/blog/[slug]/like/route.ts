import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const POST = apiErrorHandler(
  async (req: NextRequest, { params }: { params: { slug: string } }) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError(
        "Unauthorized",
        { title: "Not Authorized", message: "Please Login" },
        401
      );
    }

    const user = await client.user.findUnique({
      where: {
        username: session.user.username,
      },
    });

    const post = await client.blog.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!post || !user) {
      throw new ApiError(
        "Not Found",
        { title: "Invalid params", description: "Please enter a valid slug" },
        404
      );
    }

    //TODO: Check if the user has already liked the post or not
    const hasLiked = await client.like.findUnique({
      where: {
        postID_userId: {
          postID: post.id,
          userId: user.id,
        },
      },
    });

    if (hasLiked) {
      throw new ApiError(
        "Bad Request",
        { title: "Already Liked", description: "This post is already liked" },
        400
      );
    }

    const like = await client.like.create({
      data: {
        post: { connect: { slug: params.slug } },
        likedBy: { connect: { username: session.user.username } },
      },
    });

    return NextResponse.json("Liked post sucessfull", { status: 200 });
  }
);
export const DELETE = apiErrorHandler(
  async (req: NextRequest, { params }: { params: { slug: string } }) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError(
        "Unauthorized",
        { title: "Not Authorized", message: "Please Login" },
        401
      );
    }

    const user = await client.user.findUnique({
      where: {
        username: session.user.username,
      },
    });

    const post = await client.blog.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!post || !user) {
      throw new ApiError(
        "Not Found",
        { title: "Invalid params", description: "Please enter a valid slug" },
        404
      );
    }

    //TODO: Check if the user has already disliked the post or not
    const hasLiked = await client.like.findUnique({
      where: {
        postID_userId: {
          postID: post.id,
          userId: user.id,
        },
      },
    });

    if (!hasLiked) {
      throw new ApiError(
        "Bad Request",
        {
          title: "Already Disliked",
          description: "This post is already disliked",
        },
        400
      );
    }

    const like = await client.like.delete({
      where: {
        postID_userId: {
          postID: post.id,
          userId: user.id,
        },
      },
    });

    return NextResponse.json("Disliked post sucessfull", { status: 200 });
  }
);
