import CategoryPagePosts from "@/components/CategoryPagePosts";
import FollowTopicButton from "@/components/FollowTopicButton";
import { BlogWithoutContent, Category } from "@/types/schemaTypes";
import { checkIsFollowingTopic, fetchCategory } from "@/utils/fetchActions";
import { capitalizeSentence } from "@/utils/helpers";
import { Metadata, Viewport } from "next";

export const generateMetadata = async ({
  params,
}: {
  params: { category: string };
}): Promise<Metadata> => {
  const category: Category = await fetchCategory(params.category);
  return {
    title: capitalizeSentence(category.name),
  };
};
export const generateViewport = async ({
  params,
}: {
  params: { category: string };
}): Promise<Viewport> => {
  const category: Category = await fetchCategory(params.category);
  return {
    themeColor: category.color,
  };
};

const page = async ({ params }: { params: { category: string } }) => {
  const category: Category = await fetchCategory(params.category);
  const { isFollowing } = await checkIsFollowingTopic(params.category);
  return (
    <div className="container space-y-4">
      <section className="space-y-6">
        <main className="space-y-4 text-center">
          <h1 className="mx-auto w-[22rem] text-3xl font-bold leading-tight text-secondary-foreground">
            {capitalizeSentence(decodeURIComponent(params.category))}
          </h1>
          <p className="mx-6 text-lg font-medium ">
            Topic • {category._count.posts} Articles
          </p>
          <FollowTopicButton
            category_name={params.category}
            isFollowing={isFollowing}
          />
        </main>
      </section>
      <CategoryPagePosts
        posts={category.posts as BlogWithoutContent[]}
        categoryName={params.category}
      />
    </div>
  );
};

export default page;
