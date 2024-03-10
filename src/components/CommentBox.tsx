"use client";
import { postFetchAPi } from "@/utils/fetchData";
import { Loader2 } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const CommentBox = ({
  session,
  slug,
}: {
  session: Session | null;
  slug: string;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comment, setComment] = useState("");
  const pathname = usePathname();
  const router = useRouter();
  const handleSubmitComment = async () => {
    setIsSubmitting(true);

    const res = await postFetchAPi(`/api/blog/${slug}/comment`, { comment });

    router.refresh();
  };

  if (!session) {
    return (
      <Link href={`/login?callbackUrl=${BASE_URL + pathname}`}>
        <Button className="mt-6 w-full">Login To Comment</Button>
      </Link>
    );
  }

  return (
    <div className="mt-6 flex flex-col gap-4 rounded-md bg-white p-4 shadow-lg">
      <div className="flex items-center gap-2">
        <div className="aspect-square w-8 overflow-hidden rounded-full  lg:w-10">
          <Image
            src={session.user.image || "/images/avatarFallback.png"}
            alt="Author Profile Picture"
            width={90}
            height={90}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="font-medium">{session.user.name}</div>
      </div>
      <textarea
        className="w-full resize-none text-md outline-none"
        placeholder="What are your thoughts?"
        name="comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        id="comment"
        cols={30}
        rows={5}
      />
      <Button
        size={"sm"}
        disabled={isSubmitting}
        onClick={handleSubmitComment}
        className="w-fit self-end"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting
          </>
        ) : (
          "Submit"
        )}
      </Button>
    </div>
  );
};

export default CommentBox;
