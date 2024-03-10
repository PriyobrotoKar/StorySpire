"use client";

import { Blog, User } from "@/types/schemaTypes";
import { deleteFetchAPi, postFetchAPi } from "@/utils/fetchData";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const BlogPostBookmark = ({
  blog,
  user,
}: {
  blog: Blog & { isBookmarked: boolean };
  user: User;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isBookmarked, setIsBookmarked] = useState(blog.isBookmarked);

  const handleBookmark = async () => {
    if (user) {
      if (isBookmarked) {
        setIsBookmarked(false);
        await deleteFetchAPi(`/api/blog/${blog.slug}/bookmark`);
        router.refresh();
      } else {
        setIsBookmarked(true);
        await postFetchAPi(`/api/blog/${blog.slug}/bookmark`, {});
        router.refresh();
      }
    } else {
      router.push(`/login?callbackUrl=${BASE_URL + pathname}`);
    }
  };

  return (
    <div
      onClick={handleBookmark}
      className="flex cursor-pointer items-center justify-center text-xl"
    >
      {isBookmarked ? <BookmarkCheck /> : <Bookmark />}
    </div>
  );
};

export default BlogPostBookmark;
