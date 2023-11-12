import React from "react";
import { Button } from "./ui/button";
import { MdAdd } from "react-icons/md";
import { Input } from "./ui/input";

const AddLinkBtn = () => {
  return (
    <Button variant={"secondary"} className="gap-2 pl-2 pr-4">
      <div className="rounded-[6px] bg-slate-300 p-1">
        <MdAdd className={"text-slate-500"} />
      </div>
      <Input
        className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        type="text"
        placeholder="Type your link address"
      />
      Add
    </Button>
  );
};

export default AddLinkBtn;
