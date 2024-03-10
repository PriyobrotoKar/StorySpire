import { Comment } from "@/types/schemaTypes";
import { formatDate } from "@/utils/helpers";
import Image from "next/image";
import { Separator } from "./ui/separator";

const Comments = async ({
  slug,
  comments,
}: {
  slug: string;
  comments: Comment[] & { _count: number };
}) => {
  if (comments.length === 0) {
    return (
      <p className="py-20 text-center text-sm font-medium text-muted-foreground">
        Be the first one to comment!
      </p>
    );
  }
  return (
    <div className="mt-10 space-y-6">
      {comments.map((comment, i) => {
        return (
          <div key={comment.id} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="aspect-square w-12 overflow-hidden rounded-full shadow-xl lg:w-12">
                <Image
                  src={
                    comment.commentedBy.profile_pic ||
                    "/images/avatarFallback.png"
                  }
                  alt="Author Profile Picture"
                  width={90}
                  height={90}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <div className="text-md font-medium">
                  {comment.commentedBy.fullname}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(comment.createdAt)}
                </div>
              </div>
            </div>
            <div className="pl-2 text-md">{comment.comment}</div>
            {i !== comments.length - 1 && <Separator className="mt-6" />}
          </div>
        );
      })}
    </div>
  );
};

export default Comments;
