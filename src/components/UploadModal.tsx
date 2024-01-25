"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import { colors } from "../constants/colors";
import confetti from "canvas-confetti";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { IoMdClose } from "react-icons/io";
import { uploadToCloud } from "@/utils/uploadToCloudinary";
import { postFetchAPi } from "@/utils/fetchData";

import { useSession } from "next-auth/react";
import { Blog } from "@/types/schemaTypes";
import { BlogPreview, Tags } from "@/types/customTypes";
import BlogArticleCard from "./BlogArticleCard";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const UploadModal = ({
  image,
  title,
  content,
  words,
  showDialogue,
  setShowDialogue,
}: {
  image: {
    localPath: string;
    file: null;
  };
  title: string;
  content: any;
  words: number;
  showDialogue: boolean;
  setShowDialogue: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [tags, setTags] = useState<Tags[]>([]);
  const [topic, setTopic] = useState("");
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const confettiColors = ["#bb0000", "#ffffff"];
  const router = useRouter();

  const description = content?.blocks.find(
    (block: any) => block.type === "paragraph"
  )?.data.text;

  const blog = {
    title,
    description,
    length: words,
    thumbnail: image.localPath,
    author: {
      fullname: session?.user.name,
      username: session?.user.username,
      profile_pic: session?.user.image,
    },
    createdAt: new Date(),
    categories: tags,
  };

  const handleTopicInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newTagId = uuid();
      setTags([
        ...tags,
        {
          id: newTagId,
          name: topic,
          color: colors[Number((Math.random() * 10).toFixed(0))],
        },
      ]);
      setTopic("");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const uploadThumbUrl = image.file ? await uploadToCloud(image.file) : "";
    const categories = tags.map((tag) => ({
      name: tag.name,
      color: tag.color,
    }));
    const res = await postFetchAPi("/api/blog", {
      title,
      description,
      content,
      thumbnail: uploadThumbUrl,
      length: words,
      categories,
    });
    confetti({
      particleCount: 100,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: confettiColors,
    });
    confetti({
      particleCount: 100,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: confettiColors,
    });
    router.push(`/@${res.data.author.username}/${res.data.slug}`);
  };

  return (
    <div
      className={`absolute top-0 z-30 flex h-[100svh] w-full items-end justify-center overflow-hidden bg-neutral-500/30 backdrop-blur-sm transition md:items-center ${
        showDialogue ? "" : "pointer-events-none opacity-0"
      }`}
    >
      <main
        className={`w-full space-y-4 rounded-t-md bg-background p-4 transition md:w-[45rem] md:rounded-md md:p-8 lg:w-[50rem] ${
          showDialogue ? "" : "translate-y-full"
        }`}
      >
        <header className="mx-auto flex max-w-md items-center justify-between md:max-w-full ">
          <h1 className="text-center text-xl font-bold text-secondary-foreground md:text-left">
            Article Preview
          </h1>
          <Button
            onClick={() => setShowDialogue(false)}
            variant={"ghost"}
            className="p-1"
          >
            <IoMdClose className="text-xl" />
          </Button>
        </header>
        <hr className="md:hidden" />
        <div className="mx-auto flex max-w-md flex-col  gap-8 md:max-w-full md:flex-row">
          <section className="  flex-1 space-y-6">
            <BlogArticleCard
              size={"small"}
              blog={blog as BlogPreview}
              disableHoverCard={true}
            />
          </section>
          <section className="flex-1 space-y-6">
            <div className="space-y-2">
              <Label>
                Add or change topics (up to 5) so readers know what your story
                is about
              </Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => {
                  return (
                    <Button
                      key={tag.id}
                      className="h-8 gap-2 text-sm"
                      variant={"secondary"}
                      size={"sm"}
                      onClick={() =>
                        setTags(tags.filter((value) => value.id !== tag.id))
                      }
                    >
                      {tag.name}
                      <IoMdClose />
                    </Button>
                  );
                })}
              </div>
              <Input
                type="text"
                value={topic}
                onChange={handleTopicInput}
                onKeyUp={handleKeyUp}
                placeholder="Add a topic..."
              />
            </div>
            <div>
              <Button disabled={isSubmitting} onClick={handleSubmit}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publishing
                  </>
                ) : (
                  "Publish Now"
                )}
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UploadModal;
