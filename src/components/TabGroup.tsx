"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

interface TabProps {
  id: string;
  label: string;
  link: string;
}
interface TabGroupProps {
  tabs: TabProps[];
}

const TabGroup = ({ tabs }: TabGroupProps) => {
  const pathname = usePathname();
  const currentTab = tabs.filter((tab) => tab.link === pathname);
  const [activeTab, setActiveTab] = useState(currentTab[0]?.id);
  return (
    <nav className=" ">
      <ul className="flex gap-6 text-md">
        {tabs.map((tab) => {
          return (
            <li
              onClick={() => setActiveTab(tab.id)}
              key={tab.id}
              className={`relative cursor-pointer transition ${
                activeTab === tab.id && "text-primary"
              }`}
            >
              <Link href={tab.link}>{tab.label}</Link>
              {activeTab === tab.id && (
                <motion.div
                  layoutId="indicator"
                  className="absolute -bottom-1/2 left-[30%] h-1.5  w-6  rounded-sm bg-primary"
                ></motion.div>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default TabGroup;
