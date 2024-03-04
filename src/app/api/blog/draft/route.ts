import client from "@/lib/prisma";
import { Tags } from "@/types/customTypes";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";

import { v4 as uuid } from "uuid";

import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";

export const POST = apiErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session)
    throw new ApiError(
      "Not Authorized",
      { title: "Unauthorized", description: "Please login" },
      401
    );

  const username = session.user.username;
  // const { title } = await req.json();
  const body = await req.json();
  // const title = "This is a sample blog title";
  const slug = body.title.replaceAll(/\s+/g, "-") + "-" + uuid();

  const blog = await client.blog.create({
    data: {
      ...body,
      categories: {
        connectOrCreate: body.categories.map((cat: Tags) => {
          return {
            where: { name: cat.name },
            create: { name: cat.name, color: cat.color },
          };
        }),
      },
      slug,
      author: { connect: { username } },
      isPublished: false,
    },
    include: {
      author: true,
    },
  });

  return NextResponse.json(
    { success: true, message: "Blog drafted successfully", data: blog },
    { status: 200 }
  );
});
