"use client";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Blog, User } from "@/types/schemaTypes";
import { searchBlogs, searchUsers } from "@/utils/fetchActions";
import { Session } from "next-auth";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import BlogArticleCard from "./BlogArticleCard";
import UserCard from "./UserCard";

const isBlog = (item: Blog | User): item is Blog => {
  if ("description" in item) {
    return true;
  }
  return false;
};

const SearchResults = ({
  initialResults,
  total,
  session,
}: {
  initialResults: Blog[] | User[];
  total: number;
  session?: Session | null;
}) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const fetchNext = isBlog(initialResults[0]) ? searchBlogs : searchUsers;
  const { items, ref } = useInfiniteScroll<Blog | User>(
    initialResults,
    fetchNext,
    [query]
  );

  if (!items.length) {
    return <div>No Results Found</div>;
  }

  if (isBlog(items[0])) {
    return (
      <div className="space-y-2">
        {items.map((blog) => {
          return (
            <BlogArticleCard key={blog.id} blog={blog as Blog} size="large" />
          );
        })}
        {items.length !== total && (
          <div className="flex items-center justify-center" ref={ref}>
            <Image
              src="/loader.gif"
              alt="Loading Spinner"
              width={64}
              height={64}
            />
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {(items as User[]).map((user) => {
        if (user.username === session?.user.username) {
          return;
        }
        return <UserCard key={user.id} user={user as User} session={session} />;
      })}
      {items.length !== total && (
        <div className="flex items-center justify-center" ref={ref}>
          <Image
            src="/loader.gif"
            alt="Loading Spinner"
            width={64}
            height={64}
          />
        </div>
      )}
    </div>
  );
};

export default SearchResults;
