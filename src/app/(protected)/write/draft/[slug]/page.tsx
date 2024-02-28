import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import Editor from "@/components/Editor";
import { fetchDraftBlog } from "@/utils/fetchActions";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

const page = async ({ params }: { params: { slug: string } }) => {
  const blog = await fetchDraftBlog(params.slug);
  const session = await getServerSession(authOptions);
  if (!blog || blog.author.username !== session?.user.username) {
    return notFound();
  }
  return (
    <div>
      <Editor blog={blog} />
    </div>
  );
};

export default page;
