import BlogPostGridSkeleton from "@/components/skeletons/BlogPostGridSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center  gap-4 ">
        <Skeleton className="h-14 w-64" />
        <Skeleton className="h-10 w-52" />
        <Skeleton className="h-10 w-32" />
      </div>
      <BlogPostGridSkeleton />
    </div>
  );
};

export default Loading;
