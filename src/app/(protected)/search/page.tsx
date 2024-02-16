import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import DeleteSearchItem from "@/components/DeleteSearchItem";
import SearchBar from "@/components/SearchBar";
import { Separator } from "@/components/ui/separator";
import { fetchRecentSearches } from "@/utils/fetchActions";
import { UserSearchHistory } from "@prisma/client";
import { getServerSession } from "next-auth";
import Link from "next/link";

const page = async () => {
  const session = await getServerSession(authOptions);
  const searches: UserSearchHistory[] = session
    ? await fetchRecentSearches()
    : [];
  return (
    <div>
      <section className="space-y-6 ">
        <main className="space-y-4 text-center">
          <h1 className="mx-auto w-[22rem] text-3xl font-bold leading-tight text-secondary-foreground">
            Find <span className="text-primary">New</span> Stories
          </h1>
          <p className="mx-6 text-lg font-medium ">
            Discover more stories for your search
          </p>
        </main>
        <SearchBar />
      </section>
      <section className="container my-8 max-w-screen-md px-4">
        {session && (
          <>
            <h2 className="text-xl font-semibold">Recent Searches</h2>
            <Separator />
            {!searches.length && (
              <p className="my-10 text-center text-md text-muted-foreground">
                You have no recent searches
              </p>
            )}
            {searches.map((search) => {
              return (
                <div
                  key={search.id}
                  className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-muted"
                >
                  <Link
                    className="flex-1"
                    href={`/search/blogs?q=${search.searchQuery}`}
                  >
                    <p>{search.searchQuery}</p>
                  </Link>
                  <DeleteSearchItem id={search.id} />
                </div>
              );
            })}
          </>
        )}
      </section>
    </div>
  );
};

export default page;
