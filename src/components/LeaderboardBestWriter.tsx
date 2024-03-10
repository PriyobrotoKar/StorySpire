"use client";
import { cn } from "@/lib/utils";
import { User } from "@/types/schemaTypes";
import { motion } from "framer-motion";

import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import { useMediaQuery } from "usehooks-ts";

const getAnimationProperties = (position: "1st" | "2nd" | "3rd") => {
  if (position === "1st") {
    return {
      height: "13rem",
      delay: 0,
    };
  } else if (position === "2nd") {
    return {
      height: "11rem",
      delay: 0.1,
    };
  } else {
    return {
      height: "8rem",
      delay: 0.2,
    };
  }
};

const LeaderboardBestWriter = ({
  writer,
  position,
}: {
  writer: User & { _count: { blogs: true } };
  position: "1st" | "2nd" | "3rd";
}) => {
  const { ref, inView } = useInView({ triggerOnce: true });
  const isMobile = useMediaQuery("(max-width:768px)");
  const animationProperties = getAnimationProperties(position);

  return (
    <div ref={ref} className="relative z-10 w-[25%] space-y-2 sm:w-[20%]">
      <div className="text-center text-primary-foreground">
        <Link className="mx-auto block w-fit" href={`/@${writer.username}`}>
          <div className="h-12 w-12 overflow-hidden rounded-full outline outline-0 outline-border transition-all  hover:scale-125 hover:outline-4">
            <Image
              src={writer.profile_pic || "/images/avatarFallback.png"}
              alt="second"
              className="h-full w-full object-cover"
              width={64}
              height={64}
            />
          </div>
        </Link>
        <span className="text-md font-medium ">
          {writer.fullname.split(" ")[0]}
        </span>
      </div>
      <motion.div
        variants={{
          visible: { height: animationProperties.height },
          hidden: { height: isMobile ? animationProperties.height : "0rem" },
        }}
        animate={inView && !isMobile ? "visible" : "hidden"}
        transition={{
          duration: 0.8,
          ease: "easeInOut",
          delay: animationProperties.delay,
        }}
        className={cn(
          "flex  flex-col items-center justify-center rounded-t-md border border-border  text-secondary-foreground shadow-[inset_0px_-18px_25px_5px_#00000036]",
          { " bg-green-300": position === "2nd" },
          { "bg-primary": position === "1st" },
          { " bg-yellow-200": position === "3rd" }
        )}
      >
        <motion.div
          variants={{
            visible: { opacity: 1 },
            hidden: { opacity: 0 },
          }}
          animate={inView ? "visible" : "hidden"}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
            delay: animationProperties.delay + 0.8,
          }}
          className="text-center"
        >
          <div className="font-semibold">
            <span className="text-2xl font-bold">{position[0]}</span>
            {position.slice(1)}
          </div>
          <div className="hidden text-[0.75rem] font-semibold text-accent-foreground/70 sm:block ">
            <span className=" text-md">{writer._count.follower}</span> Followers
          </div>
          <div className="hidden text-[0.75rem] font-semibold text-accent-foreground/70 sm:block">
            <span className=" text-md ">{writer._count.blogs} </span>
            Articles
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LeaderboardBestWriter;
