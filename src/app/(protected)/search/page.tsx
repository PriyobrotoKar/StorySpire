import SearchBar from "@/components/SearchBar";

const page = () => {
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
      <section className="container my-16 text-center">
        {/* <p className="hidden text-md text-muted-foreground sm:block">
          Search for blogs, topics and authors
        </p> */}
        {/* <Image
          src={"/images/search.svg"}
          alt="search"
          width={300}
          height={300}
          className="mx-auto sm:w-[50vw] sm:max-w-2xl"
        /> */}
      </section>
    </div>
  );
};

export default page;
