import SearchResults from "@/components/SearchResults";
import { addRecentSearch, searchBlogs } from "@/utils/fetchActions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  if (!("q" in searchParams) || !searchParams.q) {
    redirect("/search");
  }
  const addSearchPromise = addRecentSearch(searchParams.q);
  const blogsPromise = searchBlogs(searchParams.q);
  const [initialResults] = await Promise.all([blogsPromise, addSearchPromise]);
  revalidatePath("/search", "page");

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
