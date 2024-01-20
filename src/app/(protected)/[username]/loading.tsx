import React from "react";
import UserBlogsSkeletons from "@/components/skeletons/UserBlogsSkeletons";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="-mt-32">
      <section>
        <Skeleton className="h-64 w-full rounded-none lg:h-[40svh]" />
      </section>
      <section className="min-h-screen w-full -translate-y-2  rounded-2xl bg-muted  ">
        <div className="container mx-auto flex flex-col  lg:flex-row">
          <div className="px-4 py-16 lg:flex-1 lg:py-24">
            <div className="absolute -top-10 h-24 w-24 overflow-hidden rounded-full border-[4px] border-white bg-muted lg:-top-16 lg:h-32  lg:w-32 ">
              <Skeleton />
            </div>
            <div className="space-y-4">
              <div className="space-y-3">
                <Skeleton className="h-7 w-52" />
                <Skeleton className="h-5 w-32" />
              </div>
              <Skeleton className="h-5 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-24" />
              </div>
            </div>
          </div>
          <div className="flex-[2_1_0%] space-y-6 lg:py-14">
            <div>
              <div className="flex gap-4 py-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Separator />
            </div>
            <UserBlogsSkeletons />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Loading;
