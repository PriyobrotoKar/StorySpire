import { Category } from "@/types/schemaTypes";
import { fetchAllCategories, sleep } from "@/utils/fetchActions";
import { capitalize, capitalizeSentence } from "@/utils/helpers";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import React from "react";
import Link from "next/link";

const CategoryList = async () => {
  const { categories }: { categories: Category[] } = await fetchAllCategories();
  return (
    <Carousel
      className="mx-10 "
      opts={{
        slidesToScroll: 4,
        skipSnaps: true,
      }}
    >
      <CarouselContent className="gap-2 py-2">
        {categories.map((category) => {
          return (
            <Link
              key={category.id}
              className=""
              href={`/explore/${category.name}`}
            >
              <CarouselItem
                className="whitespace-nowrap rounded-xl  px-4 py-2 text-sm transition-shadow hover:shadow-md hover:shadow-slate-400/20 "
                style={{ backgroundColor: `${category.color}10` }}
              >
                {capitalizeSentence(category.name)}
              </CarouselItem>
            </Link>
          );
        })}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default CategoryList;
