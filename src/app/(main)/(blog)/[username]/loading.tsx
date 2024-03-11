import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Bookmark, Heart, MessageCircle, Share2 } from "lucide-react";
import { LuEye } from "react-icons/lu";

const loading = () => {
  return (
    <div className="mb-[40rem]">
      <div className="container ">
        <div className="my-4 flex flex-col items-center gap-6 sm:my-10 sm:gap-10">
          <Skeleton className="h-4 w-44 sm:w-52"></Skeleton>
          <div className="space-y-2">
            <Skeleton className="mx-auto h-10 w-[80%] sm:h-14 sm:w-[30rem]"></Skeleton>
            <Skeleton className="mx-auto h-10 w-[20rem] sm:h-14"></Skeleton>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <Skeleton className="h-12 w-12 rounded-full sm:h-16 sm:w-16" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
          </div>

          <div className="flex animate-pulse items-center gap-4 text-xl text-muted-foreground/30">
            <LuEye />
            <Heart />
            <MessageCircle />
            <Bookmark />
            <Share2 size={18} />
          </div>
        </div>
      </div>
      <Separator className=" mt-20 sm:mt-44" />
    </div>
  );
};

export default loading;
