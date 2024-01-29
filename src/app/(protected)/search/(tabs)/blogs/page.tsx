import SearchResults from "@/components/SearchResults";
import { searchBlogs } from "@/utils/fetchActions";
import { redirect } from "next/navigation";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  if (!("q" in searchParams) || !searchParams.q) {
    redirect("/search");
  }

  const initialResults = await searchBlogs(searchParams.q);
  return (
    <div>
      <SearchResults
        initialResults={initialResults.blogs}
        total={initialResults._count}
      />
    </div>
  );
};

export default page;
