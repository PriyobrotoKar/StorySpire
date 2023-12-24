import client from "@/lib/prisma";
import apiErrorHandler from "@/utils/apiErrorHandler";
import { NextRequest, NextResponse } from "next/server";

export const GET = apiErrorHandler(
  async (
    req: NextRequest,
    { params }: { params: { category_name: string } }
  ) => {
    const popular = req.nextUrl.searchParams.get("popular");
    const offset = req.nextUrl.searchParams.get("offset") ?? 0;
    const category = await client.category.findUnique({
      where: {
        name: params.category_name,
      },
      include: {
        posts: {
          orderBy: {
            createdAt: "desc",
          },
          skip: Number(offset),
          take: 10,
          select: {
            title: true,
            thumbnail: true,
            description: true,
            id: true,
            length: true,
            slug: true,
            categories: {
              orderBy: {
                createdAt: "desc",
              },
            },
            author: true,
            createdAt: true,
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
    });

    return NextResponse.json(category, { status: 200 });
  }
);
