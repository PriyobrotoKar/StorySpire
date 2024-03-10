import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { deleteFromCloud } from "@/utils/deleteFromCloudinary";
import { deleteBlogBySlug } from "@/utils/fetchActions";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/options";
import { errResponse } from "@/utils/helpers";

export const POST = apiErrorHandler(async (req: Request) => {
  const userBody = await req.json();
  if (userBody.password) {
    const hashPass = await bcrypt.hash(userBody.password, 12);
    userBody.password = hashPass;
  }
  const user = await client.user.create({
    data: userBody,
  });
  return NextResponse.json(
    { success: true, message: "User created successfully" },
    { status: 200 }
  );
});

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

export const DELETE = apiErrorHandler(async (req: Request) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw new ApiError(
      "Not Authorized",
      { title: "Not Authorized", description: "Please login" },
      401
    );
  }

  //start deleting account
  //step1: delete all the blogs
  const userBLogs = await client.blog.findMany({
    where: {
      author: {
        username: session.user.username,
      },
    },
  });
  const user = await client.user.findUnique({
    where: {
      username: session.user.username,
    },
  });

  let deleteBlogPromises: Promise<any>[] = [];
  for (const blog of userBLogs) {
    const deleteBlogPromise = deleteBlogBySlug(blog.slug);
    deleteBlogPromises.push(deleteBlogPromise);
  }
  await Promise.all(deleteBlogPromises);

  //step2: delete the cover and profile images from cloud
  let deleteAccImgPromises = [];
  user?.profile_pic &&
    deleteAccImgPromises.push(deleteFromCloud(user?.profile_pic));
  user?.cover_pic &&
    deleteAccImgPromises.push(deleteFromCloud(user?.cover_pic));
  await Promise.all(deleteAccImgPromises);

  //step3: delete the user record
  await client.$transaction([
    client.user.update({
      where: {
        id: user?.id,
      },
      data: {
        savedBlogs: {
          set: [],
        },
      },
    }),
    client.user.delete({
      where: {
        id: user?.id,
      },
    }),
  ]);

  return NextResponse.json("Account Deleted Successfully", { status: 200 });
});
