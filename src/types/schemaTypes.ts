import { Prisma } from "@prisma/client";

export type Blog = Prisma.BlogGetPayload<{
  include: { categories: true; author: true };
}>;
