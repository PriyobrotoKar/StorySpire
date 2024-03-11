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
import { v4 } from "uuid";
import CommentBox from "./CommentBox";
import Comments from "./Comments";

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
      <SheetTrigger className=" flex items-center gap-1">
        <MessageCircle />
        {_count}
      </SheetTrigger>
      <SheetContent className="w-[90%] overflow-auto">
        <SheetHeader>
          <SheetTitle>Comments ({_count})</SheetTitle>
        </SheetHeader>

        <CommentBox key={v4()} session={session} slug={slug} />
        <Comments slug={slug} comments={comments} />
      </SheetContent>
    </Sheet>
  );
};

export default BlogPostComment;
