"use client";
import { motion } from "framer-motion";
import React, { useState } from "react";

const tabs = [
  { id: "recent", label: "Recent" },
  { id: "popular", label: "Popular" },
  { id: "about", label: "About" },
];

const UserPostNav = () => {
  const [activeTab, setActiveTab] = useState("recent");
  return (
    <nav className=" border-b py-2">
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
              {tab.label}
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

export default UserPostNav;
