import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import client from "@/lib/prisma";
import { NextResponse } from "next/server";
import {
  deleteFromCloud,
  uploadToCloudinary,
} from "@/utils/deleteFromCloudinary";

export const PATCH = apiErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session)
    throw new ApiError(
      "Not Authorized",
      { title: "Not Authorized", description: "Please login" },
      401
    );

  const body = await req.json();

  if (!body.bio || !body.fullname)
    throw new ApiError(
      "Missing Fields",
      {
        title: "Required fields are missing",
        description: "Fullname and Introduction is required",
      },
      400
    );

  const user = await client.user.findUnique({
    where: {
      username: session.user.username,
    },
    select: {
      fullname: true,
      location: true,
      bio: true,
      cover_pic: true,
      profile_pic: true,
    },
  });

  let updatedFields = {};
  for (const field in user) {
    let isFieldUpdated = false;
    const userField =
      user[field as keyof typeof user] === null
        ? ""
        : user[field as keyof typeof user];
    if (typeof body[field] === "object" && "url" in body[field]) {
      isFieldUpdated = userField !== body[field].url;
      if (isFieldUpdated) {
        if (userField && new URL(userField).hostname === "res.cloudinary.com") {
          await deleteFromCloud(userField);
        }
        const imgUrl = await uploadToCloudinary(body[field].file);
        updatedFields = { ...updatedFields, [field]: imgUrl };
      }
    } else if (typeof body[field] === "string") {
      isFieldUpdated = userField !== body[field];
      if (isFieldUpdated)
        updatedFields = { ...updatedFields, [field]: body[field] };
    }
  }

  const updatedUser = await client.user.update({
    where: {
      username: session.user.username,
    },
    data: updatedFields,
    select: {
      fullname: true,
      location: true,
      bio: true,
      cover_pic: true,
      profile_pic: true,
    },
  });

  return NextResponse.json(updatedUser, { status: 200 });
});
