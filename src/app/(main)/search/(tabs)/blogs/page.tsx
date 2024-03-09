import SearchResults from "@/components/SearchResults";
import { addRecentSearch, searchBlogs } from "@/utils/fetchActions";
import { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 } from "uuid";

export const generateMetadata = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}): Promise<Metadata> => {
  return {
    title: searchParams.q,
  };
};

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
        key={v4()}
        initialResults={initialResults.blogs}
        total={initialResults._count}
      />
    </div>
  );
};

export default page;
