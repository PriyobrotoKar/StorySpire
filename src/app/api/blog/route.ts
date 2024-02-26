import client from "@/lib/prisma";
import { Tags } from "@/types/customTypes";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { authOptions } from "../auth/[...nextauth]/options";

type categoriesToConnect = {
  where: { name: string };
  create: { name: string; color: string };
};

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
      isPublished: true,
    },
    include: {
      author: true,
    },
  });

  return NextResponse.json(
    { success: true, message: "Blog created successfully", data: blog },
    { status: 200 }
  );
});
export const PUT = apiErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session)
    throw new ApiError(
      "Not Authorized",
      { title: "Unauthorized", description: "Please login" },
      401
    );

  const username = session.user.username;
  // const { title } = await req.json();
  const { slug, ...body } = await req.json();
  const categoriesToConnect: categoriesToConnect[] = body.categories.map(
    (cat: Tags) => {
      return {
        where: { name: cat.name },
        create: { name: cat.name, color: cat.color },
      };
    }
  );

  const blog = await client.blog.update({
    where: { slug },
    data: {
      ...body,
      categories:
        categoriesToConnect.length === 0
          ? { set: [] }
          : { connectOrCreate: categoriesToConnect },

      slug,
      author: { connect: { username } },
      isPublished: true,
    },
    include: {
      author: true,
    },
  });

  return NextResponse.json(
    { success: true, message: "Blog edited successfully", data: blog },
    { status: 200 }
  );
});
