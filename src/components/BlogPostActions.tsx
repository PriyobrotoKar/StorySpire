"use client";

import { fetchDataFromApi, postFetchAPi } from "@/utils/fetchData";
import { useSession } from "next-auth/react";
import { CiBookmark, CiBookmarkCheck } from "react-icons/ci";
import { IoHeartOutline } from "react-icons/io5";
import { TbMessageCircle2 } from "react-icons/tb";
import { toast } from "./ui/use-toast";
import { Blog, User } from "@/types/schemaTypes";
import { useMemo } from "react";

const BlogPostActions = ({ blog, user }: { blog: Blog; user: User }) => {
  const { data: session } = useSession();

  return (
    <div className="relative z-10 flex gap-4">
      <div className="flex cursor-pointer items-center gap-1 text-xl">
        <IoHeartOutline />
        <span className="text-sm"></span>
      </div>
      <div className="flex cursor-pointer items-center gap-1 text-xl">
        <TbMessageCircle2 />
        <span className="text-sm"></span>
      </div>
    </div>
  );
};

export default BlogPostActions;
