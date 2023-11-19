import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { v4 as uuid } from "uuid";
import client from "@/lib/prisma";
import { Tags } from "@/components/UploadModal";

export const POST = apiErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  console.log(session);
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

  console.log({
    ...body,
    slug,
    author: { connect: { where: { username } } },
    isPublished: true,
  });

  const blog = await client.blog.create({
    data: {
      ...body,
      categories: {
        connectOrCreate: body.categories.map((cat: Tags) => {
          return {
            where: { name: cat.title },
            create: { name: cat.title, color: cat.color },
          };
        }),
      },
      slug,
      author: { connect: { username } },
      isPublished: true,
    },
  });

  return NextResponse.json(
    { status: true, message: "Blog created successfully" },
    { status: 200 }
  );
});
