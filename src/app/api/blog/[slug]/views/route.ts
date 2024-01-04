import client from "@/lib/prisma";
import apiErrorHandler from "@/utils/apiErrorHandler";
import { NextResponse } from "next/server";

export const GET = apiErrorHandler(
  async (req: Request, { params }: { params: { slug: string } }) => {
    const { slug } = params;

    const count = await client.bLogView.count({
      where: {
        blog: {
          slug,
        },
      },
    });

    return NextResponse.json({views:count}, { status: 200 });
  }
);
