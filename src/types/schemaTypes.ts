import { Prisma } from "@prisma/client";

export interface Blog
  extends Prisma.BlogGetPayload<{
    include: {
      categories: true;
      author: {
        include: { _count: { select: { follower: true; blogs: true } } };
      };
    };
  }> {}

export type BlogWithoutContent = Prisma.BlogGetPayload<{
  select: {
    title: true;
    thumbnail: true;
    description: true;
    id: true;
    length: true;
    slug: true;
    categories: true;
    author: {
      include: { _count: { select: { follower: true; blogs: true } } };
    };
    createdAt: true;
  };
}>;

export interface User
  extends Prisma.UserGetPayload<{
    include: {
      socials: true;
      _count: { select: { follower: true } };
    };
  }> {}
export type Category = Prisma.CategoryGetPayload<{
  include: {
    _count: true;
    posts: {
      select: {
        title: true;
        thumbnail: true;
        description: true;
        id: true;
        length: true;
        slug: true;
        categories: true;
        author: true;
        createdAt: true;
      };
    };
  };
}>;
