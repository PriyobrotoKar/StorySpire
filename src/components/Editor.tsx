//@ts-nocheck
"use client";
import React, { useEffect, useRef, useState } from "react";

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import Underline from "@editorjs/underline";
import List from "@editorjs/list";
import Code from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import Quote from "@editorjs/quote";
import ImageTool from "@editorjs/image";

import { Textarea } from "./ui/textarea";
import { FiImage } from "react-icons/fi";

import useAutosizeTextArea from "../hooks/useAutoSizeTextArea";
import { uploadToCloud } from "@/utils/uploadToCloudinary";
import { Button } from "./ui/button";
import UploadModal from "./UploadModal";

const Editor = () => {
  const ref = useRef<EditorJS | null>();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(null);
  const [coverImg, setCoverImg] = useState({
    localPath: "",
    file: null,
  });
  const [wordCount, setWordCount] = useState(0);
  const [showDialogue, setShowDialogue] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, title);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setTitle(val);
  };

  const countTotalWords = (blocks) => {
    return blocks
      .filter((block) => {
        return "text" in block.data || "items" in block.data;
      })
      .reduce((sum, block) => {
        if ("text" in block.data) {
          sum += block.data.text
            .replaceAll("&nbsp;", " ")
            .replaceAll(
              /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
              ""
            )
            .trim()
            .split(/\s+/).length;
          return sum;
        }
        if ("items" in block.data) {
          const count =
            block.data.items.length &&
            block.data.items
              .join(" ")
              .replaceAll("&nbsp;", " ")
              .replaceAll(
                /([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g,
                ""
              )
              .trim()
              .split(/\s+/).length;
          console.log(count);
          return sum + count;
        }
      }, 0);
  };

  const initEditor = async () => {
    const editor = new EditorJS({
      holder: "editorjs",
      onReady: () => {
        ref.current = editor;
      },
      placeholder: "Start writing your story",
      onChange: async () => {
        let data = await editor.saver.save();
        console.log(data.blocks);
        setContent(data);
        setWordCount(countTotalWords(data.blocks));
      },
      tools: {
        header: {
          class: Header,
          config: {
            levels: [2, 3, 4],
            defaultLevel: 2,
          },
        },
        list: {
          class: List,
          inlineToolbar: true,
        },
        underline: Underline,
        code: Code,
        quote: Quote,
        inlineCode: InlineCode,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                const url = await uploadToCloud(file);
                return {
                  success: 1,
                  file: {
                    url,
                  },
                };
              },
            },
          },
        },
      },
    });
  };
  useEffect(() => {
    const init = async () => {
      await initEditor();
    };

    if (mounted) {
      init();

      return () => {
        if (ref.current) {
          ref.current.destroy();
        }
      };
    }
  }, [mounted]);
  useEffect(() => {
    if (typeof window !== undefined) {
      setMounted(true);
    }
  }, []);

  return (
    <div
      className={`relative ${showDialogue ? "h-[100svh] overflow-hidden" : ""}`}
    >
      <Button
        onClick={() => setShowDialogue(true)}
        disabled={!content?.blocks.length || !title}
      >
        Publish
      </Button>

      <article className="ignoreEditorjs mx-6 mt-20 max-w-3xl space-y-2 md:mx-auto">
        <header className="text-center">
          <div className="text-sm  text-muted-foreground">
            {wordCount} Words
          </div>
        </header>
        {coverImg.localPath && (
          <div>
            <img
              className="rounded-xl shadow-2xl"
              src={coverImg.localPath}
              alt="Cover Image"
            />
          </div>
        )}
        <div className="md:mx-10">
          <label
            htmlFor="coverImg"
            className="flex w-fit items-center gap-2 rounded-md px-3 py-1 font-medium hover:cursor-pointer hover:bg-secondary"
          >
            <FiImage />
            {coverImg ? "Change Cover" : "Add Cover"}
          </label>
          <input
            id="coverImg"
            onChange={
              (e) => {
                if (e.target.files?.length) {
                  setCoverImg({
                    localPath: URL.createObjectURL(e.target.files[0]),
                    file: e.target.files[0],
                  });
                }
              }
              // console.log(e.target.files)
            }
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp"
            type="file"
          />
        </div>
        <div className="mx-0">
          <Textarea
            ref={textAreaRef}
            value={title}
            onChange={handleChange}
            placeholder="Article Title..."
            className="mx-auto max-w-2xl resize-none border-none p-0 text-2xl font-bold focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        <div id="editorjs" className=""></div>
      </article>
      <UploadModal
        showDialogue={showDialogue}
        setShowDialogue={setShowDialogue}
        image={coverImg}
        title={title}
        content={content}
        words={wordCount}
      />
    </div>
  );
};

export default Editor;
