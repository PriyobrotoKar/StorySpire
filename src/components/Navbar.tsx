import DesktopNavbar from "@/components/DesktopNavbar";
import MobileNavbar from "./MobileNavbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const Navbar = async () => {
  const session = await getServerSession(authOptions);
  return (
    <>
      <MobileNavbar session={session} />
      <DesktopNavbar session={session} />
    </>
  );
};

export default Navbar;
