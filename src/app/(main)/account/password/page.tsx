import PasswordSettingsForm from "@/components/PasswordSettingsForm";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Password",
};

const page = () => {
  return (
    <>
      <PasswordSettingsForm />
    </>
  );
};

export default page;
