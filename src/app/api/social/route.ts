import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import client from "@/lib/prisma";
import { NextResponse } from "next/server";

export const POST = apiErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session)
    throw new ApiError(
      "Not Authorized",
      { title: "Not Authorized", description: "Please login" },
      401
    );
  const user = await client.user.findUnique({
    where: {
      username: session.user.username,
    },
  });

  const { name, link } = await req.json();

  await client.social.create({
    data: {
      name,
      link,
      userId: user!.id,
    },
  });

  return NextResponse.json(
    { status: true, message: "Social added successfully" },
    { status: 200 }
  );
});
