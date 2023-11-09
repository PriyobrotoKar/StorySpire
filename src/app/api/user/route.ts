import client from "@/lib/prisma";
import apiErrorHandler from "@/utils/apiErrorHandler";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

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
    { status: true, message: "User created successfully" },
    { status: 200 }
  );
});
