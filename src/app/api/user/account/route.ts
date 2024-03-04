import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import client from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { errResponse } from "../password/route";

export const PATCH = apiErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(
      "Not Authorized",
      { title: "Not Authorized", description: "Please login" },
      401
    );
  }

  const body = await req.json();

  if (!body.username || !body.email)
    throw new ApiError(
      "Missing Fields",
      {
        title: "Required fields are missing",
        description: "Username and Email cannot be empty",
      },
      400
    );

  const user = await client.user.findUnique({
    where: {
      username: session.user.username,
    },
    select: {
      username: true,
      email: true,
      password: true,
    },
  });

  if (!user) {
    return errResponse(
      "Invalid Params",
      {
        title: "Username Invalid",
        description: "This user does not exists",
        field: "username",
      },
      404
    );
  }

  let updatedFields = {};

  for (const field in user) {
    if (field === "password") continue;
    if (user[field as keyof typeof user] !== body[field])
      updatedFields = { ...updatedFields, [field]: body[field] };
  }

  if ("username" in updatedFields) {
    const existedUser = await client.user.findUnique({
      where: {
        username: body.username,
      },
    });
    if (existedUser) {
      return errResponse(
        "Invalid Params",
        {
          title: "Username already exists",
          description: "Please enter a different username",
          field: "username",
        },
        409
      );
    }
  }

  if ("email" in updatedFields) {
    const existedUser = await client.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (existedUser) {
      return errResponse(
        "Invalid Params",
        {
          title: "Email address already exists",
          description: "Please enter a different email address",
          field: "email",
        },
        409
      );
    }

    if (user.password) {
      if (!body.password)
        return errResponse(
          "Missing Fields",
          {
            title: "Required fields are missing",
            description: "Password is required",
            field: "password",
          },
          400
        );

      const isPasswordCorrect = await bcrypt.compare(
        body.password,
        user.password
      );
      if (!isPasswordCorrect)
        return errResponse(
          "Invalid Params",
          {
            title: "Incorrect Password",
            description: "Please enter the correct password",
            field: "password",
          },
          400
        );
    }
  }

  const updatedUser = await client.user.update({
    where: {
      username: user.username,
    },
    data: updatedFields,
    select: {
      username: true,
      email: true,
    },
  });

  return NextResponse.json(updatedUser, { status: 200 });
});
