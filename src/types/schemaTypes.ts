import { Prisma } from "@prisma/client";

export interface Blog
  extends Prisma.BlogGetPayload<{
    include: { categories: true; author: true };
  }> {}
export interface User
  extends Prisma.UserGetPayload<{
    include: { socials: true };
  }> {}
