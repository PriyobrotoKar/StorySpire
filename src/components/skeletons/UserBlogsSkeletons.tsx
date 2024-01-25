import React from "react";
import { BlogPostSkeleton } from "./BlogPostCardSkeletons";
import { v4 as uuid } from "uuid";
import { Separator } from "../ui/separator";

const UserBlogsSkeletons = () => {
  return (
    <div className="space-y-6">
      {[
        ...Array(2).fill(
          <>
            <BlogPostSkeleton size="large" showAuthor={false} key={uuid()} />
            <Separator />
          </>
        ),
      ]}
    </div>
  );
};

export default UserBlogsSkeletons;
