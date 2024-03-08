import { Loader, Loader2 } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="animate-spin text-muted-foreground" />
    </div>
  );
};

export default Loading;
