"use client";
import { deleteFetchAPi } from "@/utils/fetchData";
import { useRouter } from "next/navigation";
import { MdAdd } from "react-icons/md";
import { Button } from "./ui/button";

const DeleteSearchItem = ({ id }: { id: string }) => {
  const router = useRouter();
  const handleClick = async (id: string) => {
    if (!id) {
      return;
    }

    await deleteFetchAPi(`/search/recent/${id}`);
    router.refresh();
  };
  return (
    <Button variant={"ghost"}>
      <MdAdd className="rotate-45" />
    </Button>
  );
};

export default DeleteSearchItem;
