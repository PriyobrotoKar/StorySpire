"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";
import { Separator } from "./ui/separator";

const navItems = [
  {
    path: "/account",
    name: "General",
  },
  {
    path: "/account/profile",
    name: "Edit Profile",
  },
  {
    path: "/account/password",
    name: "Password",
  },
  {
    path: "/account/socials",
    name: "Social Links",
  },
  {
    path: "/account/delete",
    name: "Delete Account",
  },
];

const MobileSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <aside className="md:hidden">
      <Select
        defaultValue={pathname}
        onValueChange={(value) => router.push(value)}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          {navItems.map((item, i: number) => {
            return (
              <SelectItem key={i + 1} value={item.path}>
                {item.name}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
    </aside>
  );
};

const DesktopSidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="hidden w-[12rem] md:block">
      <ul className="space-y-3  text-muted-foreground ">
        {navItems.map((item, i: number) => {
          return (
            <React.Fragment key={i + 1}>
              {i === navItems.length - 1 && <Separator />}
              <li
                className={twMerge(
                  ` ${
                    pathname === item.path
                      ? item.path === "/account/delete"
                        ? "bg-primary/10 font-semibold text-foreground"
                        : "font-semibold text-foreground"
                      : "transition-colors hover:text-foreground"
                  } `,
                  `${
                    item.path.includes("/delete") &&
                    "rounded-md px-2 py-1.5 text-destructive/80 transition-all hover:bg-primary/10 hover:text-destructive"
                  }`
                )}
              >
                <Link className="block w-full" href={item.path}>
                  {item.name}
                </Link>
              </li>
            </React.Fragment>
          );
        })}
      </ul>
    </aside>
  );
};

const AccountSidebar = () => {
  return (
    <>
      <MobileSidebar />
      <DesktopSidebar />
    </>
  );
};

export default AccountSidebar;
