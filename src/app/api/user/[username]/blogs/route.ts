import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { NextResponse } from "next/server";

export const GET = apiErrorHandler(
  async (req: Request, { params }: { params: { username: string } }) => {
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
        createdAt: "desc",
      },
      include: {
        categories: {
          orderBy: {
            createdAt: "desc",
          },
        },
        author: true,
      },
    });

    return NextResponse.json(blogs, { status: 200 });
  }
);
