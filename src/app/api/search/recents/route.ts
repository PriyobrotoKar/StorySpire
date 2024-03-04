import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export const POST = apiErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(
      "Not Authorized",
      { title: "Unauthorized", description: "Please login" },
      401
    );
  }
  const { query } = await req.json();

  if (!query) {
    throw new ApiError(
      "Invalid Query",
      { title: "Invalid Query", description: "Search query cannot be empty" },
      400
    );
  }

  const queryExists = await client.userSearchHistory.findFirst({
    where: {
      searchQuery: query,
      user: {
        username: session.user.username,
      },
    },
  });

  if (queryExists) {
    await client.userSearchHistory.update({
      where: queryExists,
      data: {
        createdAt: new Date(),
      },
    });
  } else {
    await client.userSearchHistory.create({
      data: {
        searchQuery: query,
        user: {
          connect: {
            username: session.user.username,
          },
        },
      },
    });
  }

  return NextResponse.json("Search query successfully saved", { status: 200 });
});

export const GET = apiErrorHandler(async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(
      "Not Authorized",
      { title: "Unauthorized", description: "Please login" },
      401
    );
  }

  const recentSearches = await client.userSearchHistory.findMany({
    where: {
      user: {
        username: session.user.username,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(recentSearches, { status: 200 });
});
