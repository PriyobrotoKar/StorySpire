"use client";

import { updateShowConfetti } from "@/reducers/ShowConfettiSlice";
import { RootState } from "@/store/store";
import { triggerConfetti } from "@/utils/clientActions";
import { useLayoutEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const Confetti = () => {
  const showConfetti = useSelector((state: RootState) => state.ShowConfetti);
  const dispatch = useDispatch();
  useLayoutEffect(() => {
    const confettiColors = ["#bb0000", "#ffffff"];
    showConfetti && triggerConfetti(confettiColors);
    dispatch(updateShowConfetti(false));
  }, [showConfetti, dispatch]);

  return <div className="absolute h-full w-full"></div>;
};

export default Confetti;
