import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(message, errResponse, status) {
    super(message),
      (this.status = status),
      (this.title = errResponse.title),
      (this.description = errResponse.description);
  }
}

const apiErrorHandler =
  (fn) =>
  async (request, ...args) => {
    try {
      return await fn(request, ...args);
    } catch (error) {
      // Log the error to a logging system
      console.log("API ERROR HANDLER", { error, location: fn.name });

      if (error instanceof Prisma.PrismaClientValidationError) {
        return NextResponse.json(
          {
            error: {
              type: "INVALID_REQUEST_BODY",
              title: "Missing required fields",
              description: "Make sure that all required fields are provided",
            },
          },
          { status: 400 }
        );
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          return NextResponse.json(
            {
              error: {
                type: "UNIQUE_VIOLATION",
                title: "The user already exists",
                description:
                  "Try creating a user with different username or email",
              },
            },
            { status: 400 }
          );
        }
      }
      // Respond with a generic 500 Internal Server Error
      return NextResponse.json(
        {
          error: {
            title: error.title || "Internal Server Error",
            description:
              error.description || "There's a problem connecting to the server",
          },
        },
        { status: error.status || 500 }
      );
    }
  };

export default apiErrorHandler;
