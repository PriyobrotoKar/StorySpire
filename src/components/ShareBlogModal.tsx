"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { extractDomain } from "@/utils/extractDomain";
import { capitalize } from "@/utils/helpers";
import { social } from "@/utils/socials";
import { motion } from "framer-motion";
import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import LinkIcon from "./LinkIcon";
import { Button } from "./ui/button";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import { Input } from "./ui/input";

const ShareBlogModal = ({ url }: { url: string }) => {
  const socialMedias = [
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    `https://twitter.com/share?url=${encodeURIComponent(url)}`,
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`,
    `https://api.whatsapp.com/send?text=${encodeURIComponent(url)}`,
    `https://www.reddit.com/submit?url=${encodeURIComponent(url)}`,
  ];
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    if (isCopied) return;
    setIsCopied(true);
    navigator.clipboard.writeText(url);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  return (
    <Dialog>
      <DialogTrigger className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-md hover:bg-accent">
        <Share2 size={16} />
        Share
      </DialogTrigger>
      <DialogContent className="w-[30rem] ">
        <DialogHeader className="space-y-4">
          <DialogTitle>Share</DialogTitle>
          <div className="flex items-center justify-between gap-4">
            {socialMedias.map((socialMedia, i) => {
              return (
                <a
                  target="_blank"
                  href={socialMedia}
                  key={i}
                  className="space-y-2"
                >
                  <div
                    style={{
                      backgroundColor:
                        social[
                          extractDomain(socialMedia) as keyof typeof social
                        ].color,
                    }}
                    className=" w-fit rounded-full p-4 text-2xl text-white"
                  >
                    <LinkIcon link={socialMedia} />
                  </div>
                  <span className=" block text-center text-sm">
                    {capitalize(extractDomain(socialMedia))}
                  </span>
                </a>
              );
            })}
          </div>
          <DialogFooter>
            <Input type="text" readOnly defaultValue={url} />
            <Button onClick={handleCopy} variant={"secondary"}>
              {!isCopied ? (
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  key={"Copy icon"}
                >
                  <Copy size={16} />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.2 }}
                  key={"Check icon"}
                >
                  <Check size={16} />
                </motion.div>
              )}
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ShareBlogModal;
