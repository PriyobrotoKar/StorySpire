"use client";
import hljs from "highlight.js";
import { useEffect, useState } from "react";

const Codeblock = ({ children }: { children: string }) => {
  const [language, setLanguage] = useState<string | undefined>("");
  const [mounted, setIsMounted] = useState(false);
  useEffect(() => {
    console.log(children);
    console.log(mounted);
    if (mounted) {
      hljs.safeMode();
      hljs.highlightAll();
    }
  }, [mounted, children]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);
  if (!mounted) {
    return;
  }
  return (
    <>
      <pre className="relative">
        <code className="bg-none">{children}</code>
      </pre>
    </>
  );
};

export default Codeblock;
