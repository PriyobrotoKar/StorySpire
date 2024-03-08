import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import SearchResults from "@/components/SearchResults";
import { searchUsers } from "@/utils/fetchActions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) => {
  if (!("q" in searchParams) || !searchParams.q) {
    redirect("/search");
  }
  const session = await getServerSession(authOptions);
  const initialResults = await searchUsers(searchParams.q);
  return (
    <div>
      <SearchResults
        initialResults={initialResults.users}
        total={initialResults._count}
        session={session}
      />
    </div>
  );
};

export default page;
