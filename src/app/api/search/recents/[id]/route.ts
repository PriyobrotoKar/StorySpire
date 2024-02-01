import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export const DELETE = apiErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(
      "Not Authorized",
      { title: "Unauthorized", description: "Please login" },
      401
    );
  }

  const { id } = await req.json();

  const queryExists = await client.userSearchHistory.findUnique({
    where: {
      id,
    },
  });

  if (!queryExists) {
    throw new ApiError(
      "Invalid Params",
      { title: "Invalid Query Id", description: "Please provide a valid id" },
      400
    );
  }

  await client.userSearchHistory.delete({
    where: queryExists,
  });

  return NextResponse.json("Search query deleted successfully", {
    status: 200,
  });
});
