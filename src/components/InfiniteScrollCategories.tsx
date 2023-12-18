"use client";
import { Blog, Category } from "@/types/schemaTypes";
import { capitalize } from "@/utils/helpers";
import React, { useEffect, useState } from "react";
import BlogArticleCard from "./BlogArticleCard";
import { useInView } from "react-intersection-observer";
import { fetchCategories } from "@/utils/fetchActions";
import { v4 as uuid } from "uuid";
import Image from "next/image";

const InfiniteScrollCategories = ({
  initialCategories,
  total,
}: {
  initialCategories: Category[];
  total: number;
}) => {
  const [topics, setTopics] = useState(initialCategories);
  const [offset, setOffset] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const { ref, inView } = useInView();

  useEffect(() => {
    const loadMoreCategories = async () => {
      const next = offset + 10;
      const { categories } = await fetchCategories(next);
      console.log(categories);
      if (categories?.length) {
        setOffset(next);
        setTopics((prev) => [...prev, ...categories]);
      }
    };
    if (inView) {
      loadMoreCategories();
    }
  }, [inView, offset]);
  return (
    <>
      {topics.map((topic) => {
        return (
          <section key={uuid()} className="space-y-2">
            <h2 className="text-xl font-bold">{capitalize(topic.name)}</h2>
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

export default InfiniteScrollCategories;
