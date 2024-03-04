import React from "react";
import { Skeleton } from "../ui/skeleton";
import { v4 as uuid } from "uuid";

const CategoryListSkeletons = () => {
  return (
    <div className="mx-10 flex gap-2 overflow-hidden py-2 lg:justify-center">
      {[
        ...Array(6).fill(
          <Skeleton key={uuid()} className="h-9 w-24 shrink-0" />
        ),
      ]}
    </div>
  );
};

export default CategoryListSkeletons;
