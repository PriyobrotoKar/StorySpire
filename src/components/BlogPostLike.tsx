"use client";

import { Blog, User } from "@/types/schemaTypes";
import { deleteFetchAPi, postFetchAPi } from "@/utils/fetchData";
import { Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const BlogPostLike = ({
  blog,
  user,
}: {
  blog: Blog & { isLiked: Boolean; _count: { Like: number } };
  user: User;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(blog.isLiked);
  const [likes, setLikes] = useState(blog._count.Like);
  const handleLike = async () => {
    if (user) {
      if (isLiked) {
        setIsLiked(false);
        setLikes(likes - 1);
        await deleteFetchAPi(`/api/blog/${blog.slug}/like`);
        router.refresh();
      } else {
        setIsLiked(true);
        setLikes(likes + 1);
        await postFetchAPi(`/api/blog/${blog.slug}/like`, {});
        router.refresh();
      }
    } else {
      router.push(`/login?callbackUrl=${BASE_URL + pathname}`);
    }
  };
  return (
    <div
      onClick={handleLike}
      className=" flex  cursor-pointer items-center gap-1 text-xl"
    >
      {isLiked ? <Heart fill="#e82c4f" strokeWidth={0} /> : <Heart />}
      {likes > 0 && <span className="text-sm">{likes}</span>}
    </div>
  );
};

export default BlogPostLike;
