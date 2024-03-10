import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { fetchBlogComments } from "@/utils/fetchActions";
import { MessageCircle } from "lucide-react";
import { Session } from "next-auth";
import Link from "next/link";
import { v4 } from "uuid";
import CommentBox from "./CommentBox";
import Comments from "./Comments";
import { Button } from "./ui/button";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const BlogPostComment = async ({
  session,
  slug,
}: {
  session: Session | null;
  slug: string;
}) => {
  const { comments, _count } = await fetchBlogComments(slug);
  return (
    <Sheet>
      <SheetTrigger className="relative z-10 flex items-center gap-1">
        <MessageCircle />
        {_count}
      </SheetTrigger>
      <SheetContent className="overflow-auto">
        <SheetHeader>
          <SheetTitle>Comments ({_count})</SheetTitle>
        </SheetHeader>
        {session ? (
          <CommentBox key={v4()} session={session} slug={slug} />
        ) : (
          <Link
            href={`/login?callbackUrl=${BASE_URL}/@${comments[0].commentedBy.username}/${slug}`}
          >
            <Button className="mt-6 w-full">Login To Comment</Button>
          </Link>
        )}

        <Comments slug={slug} comments={comments} />
      </SheetContent>
    </Sheet>
  );
};

export default BlogPostComment;
