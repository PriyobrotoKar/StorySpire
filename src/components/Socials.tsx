"use client";
import { Social } from "@prisma/client";
import React, { useState } from "react";
import AddLinkBtn from "./AddLinkBtn";
import { Button } from "./ui/button";
import LinkIcon from "./LinkIcon";
import { social as socialObj } from "@/utils/socials";
import { Link } from "lucide-react";
import { useSession } from "next-auth/react";
import { User } from "@/types/schemaTypes";

const SocialButtons = ({ social }: { social: Social }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <a
      href={social.name === "mail" ? `mailto:${social.link}` : social.link}
      target="_blank"
    >
      <Button
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        variant={"secondary"}
        className="space-x-2 pl-2  pr-4 text-sm"
        style={{
          backgroundColor: `${
            socialObj[social.name as keyof typeof socialObj]?.color +
            (isHovering ? "40" : "20")
          }`,
        }}
      >
        <span
          className="rounded-[6px] bg-slate-300  p-1.5 text-slate-500"
          style={{
            backgroundColor:
              socialObj[social.name as keyof typeof socialObj]?.color,
            color:
              socialObj[social.name as keyof typeof socialObj]?.color &&
              "white",
          }}
        >
          {<LinkIcon link={social.link} show /> || <Link />}
        </span>
        <span className="">
          {social.name in socialObj
            ? social.link.slice(social.link.lastIndexOf("/") + 1)
            : social.link.slice(8)}
        </span>
      </Button>
    </a>
  );
};

const Socials = ({ socials, user }: { socials: Social[]; user: User }) => {
  const [socialLinks, setSocialLinks] = useState(socials);
  const { data: session } = useSession();

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {socialLinks.map((social) => {
          return <SocialButtons key={social.id} social={social} />;
        })}
      </div>
      {session?.user.username === user.username && (
        <AddLinkBtn socialLinks={socialLinks} setSocialLinks={setSocialLinks} />
      )}
    </>
  );
};

export default Socials;
