import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import client from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = apiErrorHandler(
  async (request: Request, { params }: { params: { slug: string } }) => {
    const session = await getServerSession(authOptions);

    const blog = await client.blog.findUnique({
      where: {
        slug: params.slug,
      },
      include: {
        categories: {
          orderBy: {
            createdAt: "desc",
          },
        },
        author: true,
        savedBy: true,
      },
    });

    return NextResponse.json(blog, { status: 200 });
  }
);
