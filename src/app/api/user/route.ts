import client from "@/lib/prisma";
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
