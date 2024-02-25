import Editor from "@/components/Editor";
import { fetchSingleBlog } from "@/utils/fetchActions";

const page = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { tab: "drafts" | undefined };
}) => {
  const blog = await fetchSingleBlog(params.slug);
  return (
    <div>
      <Editor blog={blog} />
    </div>
  );
};

export default page;
