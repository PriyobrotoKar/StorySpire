import client from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const userBody = await req.json();
    const user = await client.user.create({
      data: userBody,
    });
    return NextResponse.json("User created successfully", { status: 200 });
  } catch (error: any) {
    console.error(error.message);
    if (error instanceof Prisma.PrismaClientValidationError) {
      return NextResponse.json(
        {
          error:
            "The request could not be understood by the server due to malformed syntax.",
        },
        { status: 400 }
      );
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error: "This user already exists.",
          },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
