import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";
import { fetchSingleUser } from "@/utils/fetchActions";
import { getServerSession } from "next-auth";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

const page = async () => {
  const session = await getServerSession(authOptions);
  const profile = await fetchSingleUser(session?.user.username);
  return (
    <>
      <ProfileSettingsForm userDetails={profile} />
    </>
  );
};

export default page;
