"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { MdAdd } from "react-icons/md";
import { Input } from "./ui/input";
import * as FontAwesome from "react-icons/fa";
import { social } from "@/utils/socials";
import { extractDomain } from "@/utils/extractDomain";
import { postFetchAPi } from "@/utils/fetchData";

const LinkIcon = ({ link, show }: { link: string; show: boolean }) => {
  const domain = extractDomain(link);

  const iconName = domain && social[domain as keyof typeof social]?.icon;
  const icon =
    iconName &&
    React.createElement(FontAwesome[iconName as keyof typeof FontAwesome]);
  return (
    <>
      {icon || (
        <MdAdd className={`transition ${!link && show && "rotate-45"}`} />
      )}
    </>
  );
};

const AddLinkBtn = () => {
  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const addSocialLink = async() => {
    const res=await postFetchAPi("/api/social",{
      name:extractDomain(input),
      link:input
    })
  };

  return (
    <Button
      variant={"secondary"}
      className={` pl-2 pr-4 ${show ? "gap-4" : "gap-2"}`}
    >
      <button
        onClick={() => !input && show && setShow(false)}
        className={`h-fit rounded-[6px] bg-slate-300 px-1 py-[0.27rem] text-slate-500  ${
          !input && show && " hover:bg-primary/20 hover:text-primary"
        }`}
      >
        <LinkIcon link={input} show={show} />
      </button>
      <Input
        className={`border-none bg-transparent  focus-visible:ring-0 focus-visible:ring-offset-0 ${
          show ? "w-auto" : "w-0 p-0"
        }`}
        type="text"
        placeholder="Type your link address"
        value={input}
        onChange={handleInputChange}
      />
      <button onClick={() => (!input ? setShow(true) : addSocialLink())}>
        Add
      </button>
    </Button>
  );
};

export default AddLinkBtn;
