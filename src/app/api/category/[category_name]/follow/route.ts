import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const GET = apiErrorHandler(
  async (req: Request, { params }: { params: { category_name: string } }) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError(
        "Not Authorized",
        { title: "Unauthorized", description: "Please login" },
        401
      );
    }
    const category = await client.category.findFirst({
      where: {
        name: params.category_name,
      },
    });

    if (!category) {
      throw new ApiError(
        "Invalid Params",
        {
          title: "Invalid category name",
          description: "Please enter a valid category",
        },
        400
      );
    }

    const isFollowing = await client.followTopic.findFirst({
      where: {
        follower: {
          username: session.user.username,
        },
        followTopic: {
          name: params.category_name,
        },
      },
    });

    return NextResponse.json(
      { isFollowing: !!isFollowing },
      {
        status: 200,
      }
    );
  }
);
export const POST = apiErrorHandler(
  async (req: Request, { params }: { params: { category_name: string } }) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError(
        "Not Authorized",
        { title: "Unauthorized", description: "Please login" },
        401
      );
    }
    const category = await client.category.findFirst({
      where: {
        name: params.category_name,
      },
    });

    if (!category) {
      throw new ApiError(
        "Invalid Params",
        {
          title: "Invalid category name",
          description: "Please enter a valid category",
        },
        400
      );
    }

    const alreadyFollowed = await client.followTopic.findFirst({
      where: {
        follower: {
          username: session.user.username,
        },
        followTopic: {
          name: params.category_name,
        },
      },
    });

    if (alreadyFollowed) {
      throw new ApiError(
        "Bad Reqeust",
        {
          title: "Already Followed",
          description: "This topic is already followed by the user",
        },
        400
      );
    }

    const followTopic = await client.followTopic.create({
      data: {
        follower: {
          connect: {
            username: session.user.username,
          },
        },
        followTopic: {
          connect: {
            name: params.category_name,
          },
        },
      },
    });

    return NextResponse.json("Successfully followed the topic", {
      status: 200,
    });
  }
);
export const DELETE = apiErrorHandler(
  async (req: Request, { params }: { params: { category_name: string } }) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError(
        "Not Authorized",
        { title: "Unauthorized", description: "Please login" },
        401
      );
    }
    const category = await client.category.findFirst({
      where: {
        name: params.category_name,
      },
    });

    if (!category) {
      throw new ApiError(
        "Invalid Params",
        {
          title: "Invalid category name",
          description: "Please enter a valid category",
        },
        400
      );
    }

    const alreadyUnfollowed = await client.followTopic.findFirst({
      where: {
        follower: {
          username: session.user.username,
        },
        followTopic: {
          name: params.category_name,
        },
      },
    });

    if (!alreadyUnfollowed) {
      throw new ApiError(
        "Bad Reqeust",
        {
          title: "Already Unfollowed",
          description: "This topic is already unfollowed by the user",
        },
        400
      );
    }

    const unfollowTopic = await client.followTopic.delete({
      where: {
        followerID_followTopicID: {
          followerID: alreadyUnfollowed.followerID,
          followTopicID: alreadyUnfollowed.followTopicID,
        },
      },
    });

    return NextResponse.json("Successfully unfollowed the topic", {
      status: 200,
    });
  }
);
