"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "./ui/separator";
import React from "react";

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
        defaultValue={pathname.slice(pathname.lastIndexOf("/") + 1)}
        onValueChange={(value) =>
          router.push(value === "account" ? `/account` : `/account/${value}`)
        }
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
                className={` ${
                  pathname === item.path
                    ? "font-semibold text-foreground"
                    : "transition-colors hover:text-foreground"
                } ${
                  item.path.includes("/delete") &&
                  "text-destructive/80 hover:text-destructive "
                }`}
              >
                <Link href={item.path}>{item.name}</Link>
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
