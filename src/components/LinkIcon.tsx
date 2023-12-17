import { extractDomain } from "@/utils/extractDomain";
import { social } from "@/utils/socials";
import * as FontAwesome from "react-icons/fa6";
import React from "react";
import { MdLink } from "react-icons/md";

const LinkIcon = ({ link }: { link: string }) => {
  const domain = extractDomain(link);

  const iconName = domain && social[domain as keyof typeof social]?.icon;
  const icon =
    iconName &&
    React.createElement(FontAwesome[iconName as keyof typeof FontAwesome]);
  return <>{icon || <MdLink className="-rotate-45" />}</>;
};

export default LinkIcon;
