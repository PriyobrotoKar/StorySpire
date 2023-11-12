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

import useAutosizeTextArea from "@/app/hooks/useAutoSizeTextArea";
import { uploadToCloud } from "@/utils/uploadToCloudinary";
import { Button } from "./ui/button";

const Editor = () => {
  const ref = useRef<EditorJS | null>();
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState([]);
  const [coverImg, setCoverImg] = useState("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useAutosizeTextArea(textAreaRef.current, title);

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = evt.target?.value;

    setTitle(val);
  };

  const initEditor = async () => {
    const editor = new EditorJS({
      holder: "editorjs",
      onReady: () => {
        ref.current = editor;
      },
      placeholder: "Start writing your story",
      onChange: async () => {
        let content = await editor.saver.save();
        setContent(content.blocks);
        console.log(content);
      },
      tools: {
        header: Header,
        list: List,
        underline: Underline,
        code: Code,
        quote: Quote,
        inlineCode: InlineCode,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file) {
                const formdata = new FormData();
                formdata.append("file", file);
                formdata.append("upload_preset", "storyspire");

                const url = await uploadToCloud(formdata);
                console.log(url);
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
    <>
      <Button disabled={!content.length || !title}>Publish</Button>
      <article className="ignoreEditorjs mx-6 mt-20 max-w-3xl space-y-2 md:mx-auto">
        {coverImg && (
          <div>
            <img
              className="rounded-xl shadow-2xl"
              src={coverImg}
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
              (e) =>
                e.target.files?.length &&
                setCoverImg(URL.createObjectURL(e.target.files[0]))
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
    </>
  );
};

export default Editor;
