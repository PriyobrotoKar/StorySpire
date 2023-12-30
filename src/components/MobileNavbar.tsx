"use client";

import { useMotionValueEvent, useScroll, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaBookmark,
  FaCompass,
  FaRegBookmark,
  FaRegCompass,
} from "react-icons/fa6";
import { GoHome, GoHomeFill, GoSearch } from "react-icons/go";
import { PiNotePencil, PiNotePencilFill } from "react-icons/pi";

const MobileNavbar = () => {
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
  const pathname = usePathname();
  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: "150%" },
      }}
      animate={showNav ? "visible" : "hidden"}
      transition={{ duration: 0.2, ease: "easeIn" }}
      style={{
        x: "-50%",
      }}
      className="fixed bottom-6 left-1/2 z-20   sm:hidden"
    >
      <nav className="w-fit rounded-xl bg-white/50 px-6 py-4 shadow-xl backdrop-blur">
        <ul className="flex items-center gap-8">
          <li className="relative text-[1.8rem]">
            <Link href={"/"}>
              {pathname === "/" ? (
                <GoHomeFill className="text-primary" />
              ) : (
                <GoHome />
              )}
            </Link>
          </li>
          <li className="relative text-[1.7rem]">
            <Link href={"/search"}>
              <GoSearch className={pathname === "/search" && "font-bold"} />
            </Link>
          </li>
          <li className="relative text-[1.8rem]">
            <Link href={"/write"}>
              {pathname === "/write" ? (
                <PiNotePencilFill className="text-primary" />
              ) : (
                <PiNotePencil />
              )}
            </Link>
          </li>
          <li className="relative text-xl">
            <Link href={"/explore"}>
              {pathname === "/explore" ? (
                <FaCompass className="text-primary" />
              ) : (
                <FaRegCompass />
              )}
            </Link>
          </li>
          <li className="relative text-xl">
            <Link href={"/saved"}>
              {pathname === "/bookmark" ? (
                <FaBookmark className="text-primary" />
              ) : (
                <FaRegBookmark />
              )}
            </Link>
          </li>
        </ul>
      </nav>
    </motion.div>
  );
};

export default MobileNavbar;
