import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const useInfiniteScroll = <T>(
  initialItems: T[],
  fetchItems: (...args: any[]) => Promise<any>,
  args?: any[]
) => {
  const [items, setItems] = useState(initialItems);
  const [offset, setOffset] = useState(0);
  const { ref, inView } = useInView();

  useEffect(() => {
    const loadMoreItems = async () => {
      const next = offset + 10;
      const res = await fetchItems(...(args as []), next);
      const newItems = Object.values(res)[0] as T[];
      console.log(newItems);
      if (newItems?.length) {
        setOffset(next);
        setItems((prev) => [...prev, ...newItems]);
      }
    };
    if (inView) {
      loadMoreItems();
    }
  }, [inView, offset, fetchItems, args]);

  return { items, ref };
};

export default useInfiniteScroll;
