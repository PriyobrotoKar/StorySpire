import client from "@/lib/prisma";
import apiErrorHandler from "@/utils/apiErrorHandler";
import { NextResponse } from "next/server";

export const GET = apiErrorHandler(async (reqest: Request) => {
  const featured = await client.blog.findMany({
    where: {
      isPublished: true,
      isFeatured: true,
    },
    include: {
      categories: {
        orderBy: {
          createdAt: "desc",
        },
      },
      author: true,
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(featured, { status: 200 });
});
