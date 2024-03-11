import Categories from "@/components/Categories";
import CategoryList from "@/components/CategoryList";
import SearchBar from "@/components/SearchBar";
import CategoryListSkeletons from "@/components/skeletons/CategoryListSkeletons";
import TopicSkeletons from "@/components/skeletons/TopicSkeletons";
import { fetchAllCategories } from "@/utils/fetchActions";
import { Suspense } from "react";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topics",
};

const CategorySection = async () => {
  const initialCategories = await fetchAllCategories(4);
  return (
    <Categories
      initialCategories={initialCategories.categories}
      total={initialCategories._count}
    />
  );
};

const page = () => {
  return (
    <div className="container space-y-10 ">
      <section className="space-y-6 ">
        <main className="space-y-4 text-center">
          <h1 className="mx-auto text-3xl font-bold leading-tight text-secondary-foreground">
            Explore <span className="text-primary">Topics</span>
          </h1>
          <p className="mx-6 text-lg font-medium ">
            Explore all the different topics
          </p>
        </main>
        <SearchBar />
      </section>
      <Suspense fallback={<CategoryListSkeletons />}>
        <CategoryList />
      </Suspense>
      <Suspense fallback={<TopicSkeletons />}>
        <CategorySection />
      </Suspense>
    </div>
  );
};

export default page;
