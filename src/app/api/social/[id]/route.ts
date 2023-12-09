import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import client from "@/lib/prisma";
import { NextResponse } from "next/server";

export const PATCH = apiErrorHandler(
  async (req: Request, { params }: { params: { id: string } }) => {
    const session = await getServerSession(authOptions);
    if (!session)
      throw new ApiError(
        "Not Authorized",
        { title: "Not Authorized", description: "Please login" },
        401
      );

    const { link, name } = await req.json();
    const updatedLink = await client.social.update({
      where: {
        id: params.id,
      },
      data: {
        link,
        name,
      },
      include: { user: true },
    });

    return NextResponse.json(updatedLink, { status: 200 });
  }
);
