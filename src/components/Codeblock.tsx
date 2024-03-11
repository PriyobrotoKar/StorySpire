"use client";

const Codeblock = ({ children }: { children: string }) => {
  return (
    <>
      <pre className="relative">
        <code className="bg-none">{children}</code>
      </pre>
    </>
  );
};

export default Codeblock;
