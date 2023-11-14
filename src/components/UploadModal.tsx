"use client";
import Image from "next/image";
import React, { useState } from "react";
import { v4 as uuid } from "uuid";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import { IoMdClose } from "react-icons/io";

interface Tags {
  id: string;
  text: string;
}

const UploadModal = ({
  image,
  title,
  content,
  showDialogue,
  setShowDialogue,
}: {
  image: string;
  title: string;
  content: any[];
  showDialogue: boolean;
  setShowDialogue: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [tags, setTags] = useState<Tags[]>([]);
  const [topic, setTopic] = useState("");

  const description = content?.find((block) => block.type === "paragraph")?.data
    .text;

  const handleTopicInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const newTagId = uuid();
      setTags([...tags, { id: newTagId, text: topic }]);
      setTopic("");
    }
  };

  return (
    <div
      className={`absolute top-0 z-10 flex h-[100svh] w-full items-end justify-center overflow-hidden bg-neutral-500/30 backdrop-blur-sm transition md:items-center ${
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
            <div className="flex h-56 items-center justify-center overflow-hidden rounded-md bg-neutral-200">
              {image ? (
                <Image
                  className="h-full w-full object-cover"
                  width={450}
                  height={250}
                  src={image}
                  alt="article preview image"
                />
              ) : (
                <p className="w-3/4 text-center text-sm text-muted-foreground">
                  Include a high-quality image in your story to make it more
                  inviting to readers.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">{title}</h2>
              <p className="line-clamp-3">{description}</p>
            </div>
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
                      className="h-8 gap-2 text-sm"
                      variant={"secondary"}
                      size={"sm"}
                      onClick={() =>
                        setTags(tags.filter((value) => value.id !== tag.id))
                      }
                    >
                      {tag.text}
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
              <Button>Publish Now</Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UploadModal;
