"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { MdAdd } from "react-icons/md";
import { Input } from "./ui/input";

import { social } from "@/utils/socials";
import { extractDomain } from "@/utils/extractDomain";
import { postFetchAPi } from "@/utils/fetchData";
import LinkIcon from "./LinkIcon";
import { Social } from "@prisma/client";
import { Loader2 } from "lucide-react";

const AddLinkBtn = ({
  setSocialLinks,
  socialLinks,
}: {
  socialLinks: Social[];
  setSocialLinks: React.Dispatch<React.SetStateAction<Social[]>>;
}) => {
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const addSocialLink = async () => {
    if (!input) return;
    setIsSubmitting(true);
    const sanitizedLink =
      input[input.length - 1] === "/" ? input.slice(0, -1) : input;
    const res = await postFetchAPi("/api/social", {
      name: extractDomain(input),
      link: sanitizedLink,
    });
    setIsSubmitting(false);
    setSocialLinks([...socialLinks, res.data]);
    setInput("");
    setShow(false);
  };

  return (
    <Button
      variant={"secondary"}
      disabled={isSubmitting}
      onClick={() => setShow(true)}
      className={` pl-2 pr-4 ${show ? "gap-4" : "gap-2"}`}
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
          !input && show ? setShow(false) : setShow(true);
        }}
        className={`h-fit rounded-[6px] bg-slate-300 px-1 py-[0.27rem] text-slate-500  ${
          !input && show && " hover:bg-primary/20 hover:text-primary"
        }`}
      >
        {<MdAdd className={`transition ${!input && show && "rotate-45"}`} />}
      </span>
      <Input
        className={`border-none bg-transparent  focus-visible:ring-0 focus-visible:ring-offset-0 ${
          show ? "w-auto" : "w-0 p-0"
        }`}
        type="text"
        placeholder="Type your link address"
        value={input}
        onChange={handleInputChange}
      />
      <span onClick={addSocialLink}>
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          "Add"
        )}
      </span>
    </Button>
  );
};

export default AddLinkBtn;
