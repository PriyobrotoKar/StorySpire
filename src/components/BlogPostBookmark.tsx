"use client";

import { Blog, User } from "@/types/schemaTypes";
import { revalidate } from "@/utils/fetchActions";
import { deleteFetchAPi, postFetchAPi } from "@/utils/fetchData";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";

const BlogPostBookmark = ({
  blog,
  user,
}: {
  blog: Blog & { isBookmarked: boolean };
  user: User;
}) => {
  const router = useRouter();
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
      router.push("/login");
    }
  };

  return (
    <div
      onClick={handleBookmark}
      className="relative z-10 cursor-pointer text-xl"
    >
      {isBookmarked ? <CiBookmarkCheck /> : <CiBookmark />}
    </div>
  );
};

export default BlogPostBookmark;
