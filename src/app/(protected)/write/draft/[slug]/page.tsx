import Editor from "@/components/Editor";
import { fetchDraftBlog } from "@/utils/fetchActions";

const page = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { tab: "drafts" | undefined };
}) => {
  const blog = await fetchDraftBlog(params.slug);
  console.log(blog);
  return (
    <div>
      <Editor blog={blog} />
    </div>
  );
};

export default page;
