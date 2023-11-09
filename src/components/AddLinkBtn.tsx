import React from "react";
import { Button } from "./ui/button";
import { MdAdd } from "react-icons/md";

const AddLinkBtn = () => {
  return (
    <Button variant={"secondary"} className="gap-2 pl-2 pr-4">
      <MdAdd className="h-7 w-7 rounded-sm bg-slate-300 p-1 text-lg text-slate-500" />
      Add
    </Button>
  );
};

export default AddLinkBtn;
