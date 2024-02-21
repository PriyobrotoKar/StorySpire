"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

interface TabProps {
  id: string;
  label: string;
  link: string;
}
interface TabGroupProps {
  tabs: TabProps[];
  // canHaveOtherLinks: boolean;
}

const TabGroup = ({ tabs }: TabGroupProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams().toString();
  const [indicator, setIndicator] = useState(v4());
  const fullPath = pathname + (searchParams ? "?" + searchParams : "");
  const currentTab = tabs.filter(
    (tab) =>
      tab.link === pathname ||
      tab.link.substring(0, tab.link.indexOf("?")) === pathname
  );
  const [activeTab, setActiveTab] = useState(currentTab[0]?.id);

  useEffect(() => {
    const validTab = tabs.filter((tab) => tab.link === fullPath);
    if (!validTab.length) {
      setActiveTab("");
    } else {
      setActiveTab(validTab[0].id);
    }
  }, [fullPath, tabs]);
  return (
    <nav className=" ">
      <ul className="flex gap-6 text-md">
        {tabs.map((tab) => {
          return (
            <li
              // onClick={() => setActiveTab(tab.id)}
              key={tab.id}
              className={`relative cursor-pointer transition ${
                activeTab === tab.id && "text-primary"
              }`}
            >
              <Link href={tab.link}>{tab.label}</Link>
              {activeTab === tab.id && (
                <motion.div
                  layoutId={indicator}
                  className="absolute -bottom-1/2 left-[30%] h-1.5 w-6 rounded-sm bg-primary"
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
