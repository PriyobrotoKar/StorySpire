"use client";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Blog, Category, User } from "@/types/schemaTypes";
import { searchBlogs, searchTopics, searchUsers } from "@/utils/fetchActions";
import { capitalizeSentence } from "@/utils/helpers";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import BlogArticleCard from "./BlogArticleCard";
import UserCard from "./UserCard";

const isBlog = (item: Blog | User | Category): item is Blog => {
  if (item && "description" in item) {
    return true;
  }
  return false;
};
const isTopic = (item: Blog | User | Category): item is Category => {
  if (item && "color" in item) {
    return true;
  }
  return false;
};

const SearchResults = ({
  initialResults,
  total,
  session,
}: {
  initialResults: Blog[] | User[] | Category[];
  total: number;
  session?: Session | null;
}) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const fetchNext = isBlog(initialResults[0])
    ? searchBlogs
    : isTopic(initialResults[0])
    ? searchTopics
    : searchUsers;
  const { items, ref } = useInfiniteScroll<Blog | User | Category>(
    initialResults,
    fetchNext,
    [query]
  );

  console.log(items);

  if (!items.length) {
    return (
      <p className="py-10 text-center text-md text-muted-foreground">
        No results found for this search
      </p>
    );
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

  if (isTopic(items[0])) {
    return (
      <div>
        <div className="flex flex-wrap gap-4">
          {(items as Category[]).map((topic) => {
            return (
              <Link href={`/explore/${topic.name}`} key={topic.id}>
                <div
                  style={{ backgroundColor: topic.color + "20" }}
                  className="rounded-full bg-secondary px-6 py-3 transition-shadow hover:shadow-xl hover:shadow-neutral-200"
                >
                  {capitalizeSentence(topic.name)}
                </div>
              </Link>
            );
          })}
        </div>
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
