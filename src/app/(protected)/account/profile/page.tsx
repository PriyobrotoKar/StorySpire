import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";
import { fetchSingleUser, sleep } from "@/utils/fetchActions";
import { getServerSession } from "next-auth";
import React from "react";

const page = async () => {
  await sleep(2000);
  const session = await getServerSession(authOptions);
  const profile = await fetchSingleUser(session?.user.username);
  return (
    <>
      <ProfileSettingsForm userDetails={profile} />
    </>
  );
};

export default page;
