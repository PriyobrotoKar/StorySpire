"use client";
import { deleteFetchAPi } from "@/utils/fetchData";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdAdd } from "react-icons/md";
import { Button } from "./ui/button";

const DeleteSearchItem = ({ id }: { id: string }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const handleClick = async (id: string) => {
    if (!id) {
      return;
    }
    setIsDeleting(true);
    await deleteFetchAPi(`/api/search/recents/${id}`);
    setIsDeleting(false);
    router.refresh();
  };
  return (
    <Button
      disabled={isDeleting}
      onClick={() => handleClick(id)}
      variant={"ghost"}
    >
      {isDeleting ? (
        <Loader2 className="mr-0.5 h-3 w-3 animate-spin" />
      ) : (
        <MdAdd className="rotate-45" />
      )}
    </Button>
  );
};

export default DeleteSearchItem;
