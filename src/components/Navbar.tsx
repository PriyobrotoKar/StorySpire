"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import {
  FaBookmark,
  FaCompass,
  FaRegBookmark,
  FaRegCompass,
  FaRegUser,
} from "react-icons/fa6";
import { GoHome, GoHomeFill, GoSearch } from "react-icons/go";
import { PiNotePencil, PiNotePencilFill } from "react-icons/pi";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useMotionValueEvent, useScroll, motion } from "framer-motion";

const MobileNav = ({ showNav }: { showNav: boolean }) => {
  const pathname = usePathname();
  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: "150%" },
      }}
      animate={showNav ? "visible" : "hidden"}
      transition={{ duration: 0.2, ease: "easeIn" }}
      style={{
        x: "-50%",
      }}
      className="fixed bottom-6 left-1/2 z-20   sm:hidden"
    >
      <nav className="w-fit rounded-xl bg-white/50 px-6 py-4 shadow-xl backdrop-blur">
        <ul className="flex items-center gap-8">
          <li className="relative text-[1.8rem]">
            <Link href={"/"}>
              {pathname === "/" ? (
                <GoHomeFill className="text-primary" />
              ) : (
                <GoHome />
              )}
            </Link>
          </li>
          <li className="relative text-[1.7rem]">
            <Link href={"/search"}>
              <GoSearch className={pathname === "/search" && "font-bold"} />
            </Link>
          </li>
          <li className="relative text-[1.8rem]">
            <Link href={"/write"}>
              {pathname === "/write" ? (
                <PiNotePencilFill className="text-primary" />
              ) : (
                <PiNotePencil />
              )}
            </Link>
          </li>
          <li className="relative text-xl">
            <Link href={"/explore"}>
              {pathname === "/explore" ? (
                <FaCompass className="text-primary" />
              ) : (
                <FaRegCompass />
              )}
            </Link>
          </li>
          <li className="relative text-xl">
            <Link href={"/saved"}>
              {pathname === "/bookmark" ? (
                <FaBookmark className="text-primary" />
              ) : (
                <FaRegBookmark />
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </motion.div>
  );
};

const DesktopNav = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAtBlogPage = pathname.includes("@") && pathname.includes("/", 1);
  return (
    <header
      className={
        "absolute top-0 z-10 hidden w-full justify-between border-b border-b-foreground/10  px-4 py-3 text-secondary backdrop-blur sm:flex " +
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
          <li>
            <Link href={"/"}>Home</Link>
          </li>
          <li>
            <Link href={"/explore"}>Explore</Link>
          </li>
          <li>Bookmarks</li>
          <li>About</li>
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

        {status === "unauthenticated" ? (
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
                  src={session?.user.image || "/images/avatarFallback.png"}
                  alt="Profile"
                  className="object-cover"
                />
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mx-2 text-lg font-medium">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={session?.user.image || "/images/avatarFallback.png"}
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
    </header>
  );
};

const Navbar = () => {
  const [showNav, setShowNav] = useState(true);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest < previous) {
      setShowNav(true);
    } else {
      setShowNav(false);
    }
  });
  return (
    <>
      <MobileNav showNav={showNav} />
      <DesktopNav />
    </>
  );
};

export default Navbar;
