"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="flex min-h-[inherit] items-center justify-center px-2 md:px-0">
      <div>
        <p className="text-sm font-semibold text-black">404 error</p>
        <h1 className="mt-3 text-2xl font-semibold text-gray-800 md:text-3xl">
          We can&apos;t find that page
        </h1>
        <p className="mt-4 text-gray-500">
          Sorry, the page you are looking for doesn&apos;t exist or has been
          moved.
        </p>
        <div className="mt-6 flex items-center space-x-3">
          <Button onClick={() => router.back()} variant={"outline"}>
            <ArrowLeft size={16} className="mr-2" />
            Go back
          </Button>
          <Button onClick={() => router.push("/")}>Homepage</Button>
        </div>
      </div>
    </div>
  );
};
export default NotFound;
