"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteFetchAPi } from "@/utils/fetchData";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

const DeleteBlogModal = ({ slug }: { slug: string }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteFetchAPi(`/api/blog/${slug}`);
    router.refresh();
  };
  return (
    <Dialog>
      <DialogTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-md hover:bg-primary/10 hover:text-primary">
        <Trash2 size={16} />
        Delete
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <span className="mb-2 block w-fit rounded-full bg-primary/10 p-3  text-primary">
              <AlertTriangle />
            </span>
            Are you absolutely sure?
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your blog
            post and remove its data from our servers.
          </DialogDescription>
          <DialogFooter>
            <Button
              disabled={isDeleting}
              onClick={handleDelete}
              variant={"destructive"}
              className="mt-6 w-full bg-primary/10 hover:bg-primary/30"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting
                </>
              ) : (
                "Delete Blog Permanently"
              )}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBlogModal;
