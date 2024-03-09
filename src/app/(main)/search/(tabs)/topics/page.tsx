import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SearchResults from "@/components/SearchResults";
import { searchTopics } from "@/utils/fetchActions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
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
  const session = await getServerSession(authOptions);
  const initialResults = await searchTopics(searchParams.q);

  return (
    <div>
      <SearchResults
        key={v4()}
        initialResults={initialResults.topics}
        total={initialResults._count}
        session={session}
      />
    </div>
  );
};

export default page;
