import { v4 as uuid } from "uuid";
import { Separator } from "../ui/separator";
import { BlogPostSkeleton } from "./BlogPostCardSkeletons";

const UserBlogsSkeletons = () => {
  return (
    <div className=" space-y-6">
      {[
        ...Array(2).fill(
          <div key={uuid()}>
            <BlogPostSkeleton size="large" showAuthor={false}  />
            <Separator />
          </div>
        ),
      ]}
    </div>
  );
};

export default UserBlogsSkeletons;
