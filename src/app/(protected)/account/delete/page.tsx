"use client";
import { Button } from "@/components/ui/button";
import { deleteFetchAPi } from "@/utils/fetchData";
import { Loader2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const handleAccountDelete = async () => {
    setIsDeleting(true);
    await deleteFetchAPi("/api/user");
    await signOut({ callbackUrl: "/" });
  };
  return (
    <div className="space-y-4">
      <main>
        <h1 className="text-2xl font-semibold">
          We&apos;re sorry to see you go
        </h1>
        <p>
          Be advised, account deletion is{" "}
          <span className="font-medium">final</span>. There will be no way to
          restore your account.
        </p>
      </main>
      <div className="space-x-4">
        <Button variant={"secondary"}>Nevermind</Button>
        <Button
          disabled={isDeleting}
          onClick={handleAccountDelete}
          variant={"destructive"}
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting
            </>
          ) : (
            "Delete my account"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Page;
