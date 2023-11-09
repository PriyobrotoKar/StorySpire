import client from "@/lib/prisma";
import { NextResponse } from "next/server";
import apiErrorHandler from "../../../../utils/apiErrorHandler";

export const GET = apiErrorHandler(
  async (request: Request, { params }: { params: { username: string } }) => {
    const user = await client.user.findUnique({
      where: {
        username: params.username,
      },
    });
    return NextResponse.json(user, { status: 200 });
  }
);
