import { useMotionValueEvent, useScroll } from "framer-motion";
import React, { useState } from "react";

const useToggleNavbar = () => {
  const [showNav, setShowNav] = useState(true);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest < previous) {
      setShowNav(true);
    } else {
      setShowNav(false);
    }
  });

  return showNav;
};

export default useToggleNavbar;
