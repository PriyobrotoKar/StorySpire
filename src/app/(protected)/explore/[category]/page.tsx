import CategoryPagePosts from "@/components/CategoryPagePosts";
import FollowTopicButton from "@/components/FollowTopicButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Category } from "@/types/schemaTypes";
import { checkIsFollowingTopic, fetchCategory } from "@/utils/fetchActions";
import { capitalize } from "@/utils/helpers";
import React from "react";
import { FiSearch } from "react-icons/fi";

const page = async ({ params }: { params: { category: string } }) => {
  const category: Category = await fetchCategory(params.category);
  const { isFollowing } = await checkIsFollowingTopic(category.name);
  return (
    <div className="container">
      <section className="space-y-6 pt-10 sm:pt-28">
        <main className="space-y-4 text-center">
          <h1 className="mx-auto w-[22rem] text-3xl font-bold leading-tight text-secondary-foreground">
            {capitalize(category.name)}
          </h1>
          <p className="mx-6 text-lg font-medium ">
            Topic • {category._count.posts} Articles
          </p>
          <FollowTopicButton
            category_name={category.name}
            isFollowing={isFollowing}
          />
        </main>
      </section>
      <CategoryPagePosts posts={category.posts} categoryName={category.name} />
    </div>
  );
};

export default page;
