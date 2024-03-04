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
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "./ui/button";

const DeleteBlogModal = () => {
  const handleDelete = async () => {
    console.log("Delete blog");
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
              onClick={handleDelete}
              variant={"destructive"}
              className="mt-6 w-full bg-primary/10 hover:bg-primary/30"
            >
              Delete Blog Permanently
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBlogModal;
