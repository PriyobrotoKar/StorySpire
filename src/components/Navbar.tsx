"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
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
import { CiUser } from "react-icons/ci";
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

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 sm:hidden">
      <nav className="w-fit rounded-xl bg-white/50 px-6 py-4 shadow-xl">
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
    </div>
  );
};

const DesktopNav = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAtBlogPage = pathname.includes("@") && pathname.includes("/", 1);
  return (
    <div>
      <header className="absolute top-0 z-10 flex w-full justify-between p-4 text-secondary">
        <div>
          <Image
            src={isAtBlogPage ? "/logo-white.svg" : "/logo.svg"}
            alt="Logo"
            width={120}
            height={36}
          />
        </div>
        <nav>
          <ul
            className={`flex h-full items-center gap-12 text-md font-medium ${
              !isAtBlogPage ? "text-foreground" : ""
            } `}
          >
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>Explore</li>
            <li>Bookmarks</li>
            <li>About</li>
          </ul>
        </nav>
        <div className="flex items-center gap-6">
          <Link href={"/search"}>
            <Button
              variant={"secondary"}
              className={`rounded-full px-[0.65rem] text-lg ${
                isAtBlogPage
                  ? "bg-secondary/30 text-muted hover:bg-secondary/50"
                  : ""
              }`}
            >
              <GoSearch />
            </Button>
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
              <DropdownMenuTrigger>
                <Avatar>
                  <AvatarImage
                    src={session?.user.image || "/images/avatarFallback.png"}
                    alt="Profile"
                  />
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mx-2 text-lg font-medium">
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
    </div>
  );
};

const Navbar = () => {
  return (
    <>
      <MobileNav />
      <DesktopNav />
    </>
  );
};

export default Navbar;
