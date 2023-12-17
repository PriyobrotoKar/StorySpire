import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";
import { fetchSingleUser } from "@/utils/fetchActions";
import { getServerSession } from "next-auth";
import React from "react";

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
