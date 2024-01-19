import Categories from "@/components/Categories";
import CategoryList from "@/components/CategoryList";
import CategoryListSkeletons from "@/components/skeletons/CategoryListSkeletons";
import TopicSkeletons from "@/components/skeletons/TopicSkeletons";
import { Input } from "@/components/ui/input";
import { fetchAllCategories, sleep } from "@/utils/fetchActions";
import React, { Suspense } from "react";
import { FiSearch } from "react-icons/fi";

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
      <section className="space-y-6 pt-10 sm:pt-28">
        <main className="space-y-4 text-center">
          <h1 className="mx-auto w-[22rem] text-3xl font-bold leading-tight text-secondary-foreground">
            Explore <span className="text-primary">Topics</span>
          </h1>
          <p className="mx-6 text-lg font-medium ">
            (Have to change this subtitle)
          </p>
        </main>
        <div className=" mx-6 flex max-w-xl items-center gap-2 rounded-md border border-white px-4 shadow-lg focus-within:ring-1 focus-within:ring-ring focus-within:ring-offset-1 sm:mx-auto">
          <FiSearch className="text-lg text-primary" />
          <Input
            type="text"
            placeholder="Search blogs by topic or keywords..."
            className="border-none  focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
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
