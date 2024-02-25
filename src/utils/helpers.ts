// @ts-ignore
import ImageTool from "@editorjs/image";
import { deleteFromCloud } from "./deleteFromCloudinary";

export const readingTime = (words: number) => {
  const wpm = 225;
  return Math.ceil(words / wpm);
};

export const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    dateStyle: "medium",
  });
};

export const capitalize = (text: string | null) => {
  if (!text) return "";
  return text[0].toUpperCase() + text.slice(1);
};

export const capitalizeSentence = (sentence: string) => {
  const capWords = sentence.split(" ").map((word) => capitalize(word));
  return capWords.join(" ");
};

export class MyImageTool extends ImageTool {
  removed() {
    const data = (this as any)._data;
    console.log(data);
    deleteFromCloud(data.file.url)
      .then(() => console.log("Image successfully deleted"))
      .catch((error) => console.log("Error in removing the image"));
  }
}
