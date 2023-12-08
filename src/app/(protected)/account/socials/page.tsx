/*
//TODO: List all social links
TODO: Add the edit link feature
TODO: Add deletion of like feature
TODO: Add dragging and sorting of the links
*/

import SocialLinksSettings from "@/components/SocialLinksSettings";
import { fetchCurrentUserSocialLinks } from "@/utils/fetchActions";
import React from "react";

const page = async () => {
  const socials = await fetchCurrentUserSocialLinks();
  return (
    <section>
      <SocialLinksSettings socials={socials} />
    </section>
  );
};

export default page;
