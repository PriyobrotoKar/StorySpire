import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiErrorHandler(async (req: NextRequest) => {
  //   const session = await getServerSession(authOptions);
  const query = req.nextUrl.searchParams.get("q");
  const offset = req.nextUrl.searchParams.get("offset") ?? 0;
  const topicCount = req.nextUrl.searchParams.get("topic_count") ?? 20;

  if (!query) {
    throw new ApiError(
      "Invalid Query",
      { title: "No query provided", description: "Please enter a valid query" },
      400
    );
  }

  const dbQuery: Prisma.CategoryWhereInput | undefined = {
    name: {
      contains: query,
      mode: "insensitive",
    },
  };

  const topics = await client.category.findMany({
    where: dbQuery,
    select: {
      id: true,
      color: true,
      name: true,
    },
    take: Number(topicCount),
    skip: Number(offset),
  });

  const resultCount = await client.category.count({
    where: dbQuery,
  });

  return NextResponse.json({ topics, _count: resultCount }, { status: 200 });
});
