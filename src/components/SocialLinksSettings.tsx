"use client";
import { Social } from "@prisma/client";
import { social as socialObj } from "@/utils/socials";
import React, { useState } from "react";
import LinkIcon from "./LinkIcon";
import { capitalize } from "@/utils/helpers";
import { Input } from "./ui/input";
import { MdDragIndicator } from "react-icons/md";

const SocialLinkSettingItem = ({ social }: { social: Social }) => {
  const [input, setInput] = useState(social.link);
  return (
    <div
      className="flex gap-2 rounded-lg bg-secondary/60 p-2"
      style={{
        backgroundColor: `${
          socialObj[social.name as keyof typeof socialObj]?.color + "30"
        }`,
      }}
    >
      <div className="flex-initial pt-1">
        <MdDragIndicator />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <div
            className="w-fit rounded-sm bg-accent-foreground/50 p-1.5 text-white"
            style={{
              backgroundColor: `${socialObj[
                social.name as keyof typeof socialObj
              ]?.color}`,
              boxShadow: `0 4px 20px 5px ${
                socialObj[social.name as keyof typeof socialObj]?.color + "60"
              }`,
            }}
          >
            <LinkIcon link={social.link} />
          </div>
          <div className="font-medium">{capitalize(social.name)}</div>
        </div>
        <div>
          <Input
            type="url"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type URL here..."
            autoComplete="url"
          />
        </div>
      </div>
    </div>
  );
};

const SocialLinksSettings = ({ socials }: { socials: Social[] }) => {
  console.log(socials);
  return (
    <div className="space-y-2">
      {socials.map((social) => {
        return <SocialLinkSettingItem key={social.id} social={social} />;
      })}
    </div>
  );
};

export default SocialLinksSettings;
