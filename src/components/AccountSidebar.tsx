"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePathname, useRouter } from "next/navigation";

const MobileSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <aside>
      <Select
        defaultValue={pathname.slice(pathname.lastIndexOf("/") + 1)}
        onValueChange={(value) =>
          router.push(value === "general" ? `/account` : `/account/${value}`)
        }
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="general">General</SelectItem>
          <SelectItem value="profile">Edit Profile</SelectItem>
          <SelectItem value="password">Password</SelectItem>
        </SelectContent>
      </Select>
    </aside>
  );
};

const AccountSidebar = () => {
  return (
    <div>
      <MobileSidebar />
    </div>
  );
};

export default AccountSidebar;
