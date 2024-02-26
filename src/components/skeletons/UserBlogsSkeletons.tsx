import { v4 as uuid } from "uuid";
import { BlogPostSkeleton } from "./BlogPostCardSkeletons";

const UserBlogsSkeletons = () => {
  return (
    <div className=" space-y-14">
      {[
        ...Array(2).fill(
          <BlogPostSkeleton key={uuid()} size="large" showAuthor={false} />
        ),
      ]}
    </div>
  );
};

export default UserBlogsSkeletons;
