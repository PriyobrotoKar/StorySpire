"use client";
import { updateViewStatus } from "@/reducers/BlogBannerInViewSlice";
import { ReactNode, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useDispatch } from "react-redux";

const ObserverWrapper = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { ref, inView } = useInView();

  useEffect(() => {
    dispatch(updateViewStatus(inView));
  }, [inView, dispatch]);
  return <div ref={ref}>{children}</div>;
};

export default ObserverWrapper;
