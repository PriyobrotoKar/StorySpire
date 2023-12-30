"use client";

import { Blog, User } from "@/types/schemaTypes";
import { deleteFetchAPi, postFetchAPi } from "@/utils/fetchData";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

const BlogPostLike = ({
  blog,
  user,
}: {
  blog: Blog & { isLiked: Boolean; _count: { Like: number } };
  user: User;
}) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(blog.isLiked);
  const [likes, setLikes] = useState(blog._count.Like);
  const handleLike = async () => {
    if (user) {
      if (isLiked) {
        setIsLiked(false);
        setLikes(likes - 1);
        await deleteFetchAPi(`/api/blog/${blog.slug}/like`);
      } else {
        setIsLiked(true);
        setLikes(likes + 1);
        await postFetchAPi(`/api/blog/${blog.slug}/like`, {});
      }
    } else {
      router.push("/login");
    }
  };
  return (
    <div
      onClick={handleLike}
      className=" relative z-10 flex  cursor-pointer items-center gap-1 text-xl"
    >
      {isLiked ? <IoHeart /> : <IoHeartOutline />}
      {likes > 0 && <span className="text-sm">{likes}</span>}
    </div>
  );
};

export default BlogPostLike;
