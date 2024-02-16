import CategoryPagePosts from "@/components/CategoryPagePosts";
import FollowTopicButton from "@/components/FollowTopicButton";
import { BlogWithoutContent, Category } from "@/types/schemaTypes";
import { checkIsFollowingTopic, fetchCategory } from "@/utils/fetchActions";
import { capitalize } from "@/utils/helpers";

const page = async ({ params }: { params: { category: string } }) => {
  const category: Category = await fetchCategory(params.category);
  const { isFollowing } = await checkIsFollowingTopic(params.category);
  return (
    <div className="container">
      <section className="space-y-6">
        <main className="space-y-4 text-center">
          <h1 className="mx-auto w-[22rem] text-3xl font-bold leading-tight text-secondary-foreground">
            {capitalize(params.category)}
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
