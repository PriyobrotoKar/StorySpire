"use client";

import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { GoSearch } from "react-icons/go";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaRegUser } from "react-icons/fa6";
import { PiNotePencil } from "react-icons/pi";
import { signOut } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";
import { LuSettings } from "react-icons/lu";
import { motion } from "framer-motion";
import TabGroup from "./TabGroup";
import useToggleNavbar from "@/hooks/useToggleNavbar";
import { useMediaQuery } from "usehooks-ts";
import { useEffect, useState } from "react";

const tabs = [
  { id: "home", label: "Home", link: "/" },
  { id: "explore", label: "Explore", link: "/explore" },
  { id: "bookmark", label: "Bookmark", link: "/bookmarks" },
  { id: "about", label: "About", link: "/" },
];

const DesktopNavbar = ({ session }: { session: Session | null }) => {
  const router = useRouter();
  const showNav = useToggleNavbar();
  const matches = useMediaQuery("(max-width: 639px)");
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const isAtBlogPage = pathname.includes("@") && pathname.includes("/", 1);

  useEffect(() => {
    setIsMobile(matches);
  }, [matches]);

  return (
    <div>
      {!isMobile && (
        <motion.header
          variants={{
            visible: { y: "0" },
            hidden: { y: "-100%" },
          }}
          animate={showNav ? "visible" : "hidden"}
          transition={{ duration: 0.2, ease: "easeIn" }}
          className={
            "sticky top-0 z-10 hidden  w-full justify-between border-b border-b-foreground/10  px-4 py-3 text-secondary backdrop-blur sm:flex " +
            (isAtBlogPage ? "bg-background/5" : "bg-background/60")
          }
        >
          <div className="flex items-center justify-center">
            <Image
              src={isAtBlogPage ? "/logo-white.svg" : "/logo.svg"}
              alt="Logo"
              width={120}
              height={36}
            />
          </div>
          <nav>
            <ul
              className={`flex h-full items-center gap-6 text-md font-medium lg:gap-12 ${
                !isAtBlogPage ? "text-foreground" : ""
              } `}
            >
              <TabGroup tabs={tabs} />
            </ul>
          </nav>
          <div className="flex items-center gap-6">
            <Link
              href={"/search"}
              className={`flex h-full items-center justify-center rounded-full px-[0.65rem] text-lg ${
                isAtBlogPage
                  ? "bg-secondary/30 text-muted hover:bg-secondary/50"
                  : "bg-secondary text-foreground"
              }`}
            >
              <GoSearch />
            </Link>

            {!session ? (
              <Button
                variant={isAtBlogPage ? "secondary" : "default"}
                onClick={() => router.push("/login")}
                className={
                  isAtBlogPage
                    ? "bg-secondary/30 text-muted hover:bg-secondary/50"
                    : ""
                }
              >
                Login
              </Button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="rounded-full">
                  <Avatar>
                    <AvatarImage
                      src={session.user.image}
                      alt="Profile"
                      className="object-cover"
                    />
                    <AvatarFallback>
                      <Image
                        width={42}
                        height={42}
                        src="/images/avatarFallback.png"
                        alt=""
                      />
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mx-2 text-lg font-medium">
                  <DropdownMenuLabel className="flex items-center gap-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={session.user.image || "/images/avatarFallback.png"}
                        alt="Profile"
                        className="object-cover"
                      />
                    </Avatar>
                    <div>
                      <div className="text-md">{session?.user.name}</div>
                      <div className="font-medium ">{session?.user.email}</div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href={`/@${session?.user.username}`}>
                    <DropdownMenuItem>
                      <FaRegUser />
                      Profile
                    </DropdownMenuItem>
                  </Link>
                  <Link href={"/write"}>
                    <DropdownMenuItem>
                      <PiNotePencil className="text-lg" />
                      Write
                    </DropdownMenuItem>
                  </Link>
                  <Link href={"/account"}>
                    <DropdownMenuItem>
                      <LuSettings className="text-lg" />
                      Settings
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="focus:bg-primary/10 focus:text-primary"
                  >
                    <FiLogOut />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </motion.header>
      )}
    </div>
  );
};

export default DesktopNavbar;
