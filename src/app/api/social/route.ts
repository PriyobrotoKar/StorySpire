import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import client from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Social } from "@prisma/client";

export const POST = apiErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session)
    throw new ApiError(
      "Not Authorized",
      { title: "Not Authorized", description: "Please login" },
      401
    );

  const { name, link } = await req.json();

  const data = await client.social.create({
    data: {
      name,
      link,
      user: {
        connect: {
          username: session.user.username,
        },
      },
    },
  });

  return NextResponse.json(
    { status: true, data, message: "Social added successfully" },
    { status: 200 }
  );
});

export const GET = apiErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session)
    throw new ApiError(
      "Not Authorized",
      { title: "Not Authorized", description: "Please login" },
      401
    );

  const socials = await client.social.findMany({
    where: {
      user: {
        username: session.user.username,
      },
    },
  });

  return NextResponse.json(socials, { status: 200 });
});

export const PATCH = apiErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session)
    throw new ApiError(
      "Not Authorized",
      { title: "Not Authorized", description: "Please login" },
      401
    );
  const data = await req.json();
  const newData = data.map((item: Social) => ({
    name: item.name,
    link: item.link,
  }));
  const socials = await client.user.update({
    where: {
      username: session.user.username,
    },
    data: {
      socials: {
        deleteMany: {},
        create: newData,
      },
    },
  });
  return NextResponse.json(socials, { status: 200 });
});
