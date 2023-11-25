"use client";
import hljs from "highlight.js";
import React, { useEffect, useState } from "react";

const Codeblock = ({ children }: { children: string }) => {
  const [language, setLanguage] = useState<string | undefined>("");
  useEffect(() => {
    hljs.highlightAll();
    setLanguage(hljs.highlightAuto(children).language);
  }, []);
  return (
    <>
      <pre className="relative">
        <div className="absolute right-4 top-2 text-sm">{language}</div>
        <code className="bg-none">{children}</code>
      </pre>
    </>
  );
};

export default Codeblock;
