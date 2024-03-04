"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BASE_URL } from "@/constants/constant";
import { BlogPreview } from "@/types/customTypes";
import { BlogWithoutContent } from "@/types/schemaTypes";
import { Bookmark, MoreHorizontal, Pencil } from "lucide-react";
import { useSession } from "next-auth/react";
import DeleteBlogModal from "./DeleteBlogModal";
import ShareBlogModal from "./ShareBlogModal";
import { Button } from "./ui/button";

const BlogArticleOptions = ({
  blog,
}: {
  blog: BlogPreview | BlogWithoutContent;
}) => {
  const { data: session } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"ghost"}
          size={"sm"}
          className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 data-[state=open]:bg-accent data-[state=open]:text-foreground data-[state=open]:opacity-100"
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" font-medium">
        <DropdownMenuItem asChild>
          <ShareBlogModal
            url={`${BASE_URL}/@${blog.author.username}/${blog.slug}`}
          />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bookmark size={16} />
          Bookmark
        </DropdownMenuItem>
        {blog.author.username === session?.user.username && (
          <>
            <a
              href={
                blog.isPublished
                  ? `/write/${blog.slug}`
                  : `/write/draft/${blog.slug}`
              }
            >
              <DropdownMenuItem>
                <Pencil size={16} />
                Edit
              </DropdownMenuItem>
            </a>
            <DropdownMenuItem asChild>
              <DeleteBlogModal />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BlogArticleOptions;
