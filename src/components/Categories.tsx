"use client";
import { Blog, Category } from "@/types/schemaTypes";
import { capitalize } from "@/utils/helpers";
import BlogArticleCard from "./BlogArticleCard";
import { FaArrowRightLong } from "react-icons/fa6";
import { fetchCategories } from "@/utils/fetchActions";
import { v4 as uuid } from "uuid";
import Image from "next/image";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Button } from "./ui/button";
import Link from "next/link";

const Categories = ({
  initialCategories,
  total,
}: {
  initialCategories: Category[];
  total: number;
}) => {
  const { items: topics, ref } = useInfiniteScroll<Category>(
    initialCategories,
    fetchCategories
  );

  return (
    <>
      {topics.map((topic) => {
        return (
          <section key={uuid()} className="space-y-2">
            <div className="flex justify-between gap-8">
              <h2 className="text-xl font-bold">{capitalize(topic.name)}</h2>
              <Link href={`/category/${topic.name.toLowerCase()}`}>
                <Button className="group gap-2">
                  View All
                  <FaArrowRightLong
                    className={"transition delay-75 group-hover:translate-x-1"}
                  />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 overflow-hidden sm:grid-cols-2  sm:gap-2 lg:auto-rows-[0rem] lg:grid-cols-3 lg:grid-rows-1 2xl:grid-cols-4">
              {topic.posts.map((post) => {
                return (
                  <BlogArticleCard
                    key={post.id}
                    blog={post as Blog}
                    size="small"
                    showTopic={false}
                  />
                );
              })}
            </div>
          </section>
        );
      })}
      {topics.length !== total && (
        <div className="flex items-center justify-center" ref={ref}>
          <Image
            src="/loader.gif"
            alt="Loading Spinner"
            width={64}
            height={64}
          />
        </div>
      )}
    </>
  );
};

export default Categories;
