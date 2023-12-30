import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import client from "@/lib/prisma";
import apiErrorHandler, { ApiError } from "@/utils/apiErrorHandler";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export const POST = apiErrorHandler(
  async (req: Request, { params }: { params: { slug: string } }) => {
    const session = await getServerSession(authOptions);
    if (!session) {
      throw new ApiError(
        "Unauthorized",
        { title: "Not Authorized", message: "Please Login" },
        401
      );
    }

    const blog = await client.blog.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!blog) {
      throw new ApiError(
        "Invalid Params",
        { title: "Invalid Blog Slug", desciption: "Please enter a valid slug" },
        400
      );
    }

    const updatedBookmark = await client.user.update({
      where: {
        username: session.user.username,
      },
      data: {
        savedBlogs: {
          connect: {
            id: blog.id,
          },
        },
      },
    });
    revalidatePath("/bookmarks");
    revalidatePath(`/@${updatedBookmark.username}/${blog.slug}`);

    return NextResponse.json("Bookmark added successfully", { status: 200 });
  }
);
export const DELETE = apiErrorHandler(
  async (req: NextRequest, { params }: { params: { slug: string } }) => {
    const session = await getServerSession(authOptions);
    const path = req.nextUrl.pathname;
    console.log(path);
    if (!session) {
      throw new ApiError(
        "Unauthorized",
        { title: "Not Authorized", message: "Please Login" },
        401
      );
    }

    const blog = await client.blog.findUnique({
      where: {
        slug: params.slug,
      },
    });

    if (!blog) {
      throw new ApiError(
        "Invalid Params",
        { title: "Invalid Blog Slug", desciption: "Please enter a valid slug" },
        400
      );
    }

    const updatedBookmark = await client.user.update({
      where: {
        username: session.user.username,
      },
      data: {
        savedBlogs: {
          disconnect: {
            id: blog.id,
          },
        },
      },
    });

    revalidatePath("/bookmarks");
    revalidatePath(`/@${updatedBookmark.username}/${blog.slug}`);

    return NextResponse.json("Bookmark added successfully", { status: 200 });
  }
);
