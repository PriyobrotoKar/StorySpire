import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";

export const GET = apiErrorHandler(async (req: NextRequest) => {
  const session = await getServerSession(authOptions);
  const query = req.nextUrl.searchParams.get("q");
  console.log(query);

  if (!query) {
    throw new ApiError(
      "Invalid Query",
      { title: "No query provided", description: "Please enter a valid query" },
      400
    );
  }

  const blogsPromise = client.blog.findMany({
    where: {
      OR: [
        {
          title: {
            startsWith: query,
            mode: "insensitive",
          },
        },
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            startsWith: query,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          author: {
            fullname: {
              startsWith: query,
              mode: "insensitive",
            },
          },
        },
        {
          author: {
            username: query,
          },
        },
      ],
    },
    take: 3,
  });
  const authorPromise = client.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          fullname: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    },
    take: 3,
  });
  const topicPromise = client.category.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: 3,
  });

  const [blogs, authors, topics] = await Promise.all([
    blogsPromise,
    authorPromise,
    topicPromise,
  ]);

  return NextResponse.json({ blogs, authors, topics }, { status: 200 });
});
