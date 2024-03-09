import SocialLinksSettings from "@/components/SocialLinksSettings";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Socials",
};

const page = async () => {
  return (
    <>
      <SocialLinksSettings />
    </>
  );
};

export default page;
