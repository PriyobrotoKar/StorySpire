import { GeneralSettingsForms } from "@/components/AccountSettingsForms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

const page = async () => {
  return (
    <>
      <GeneralSettingsForms />
    </>
  );
};

export default page;
