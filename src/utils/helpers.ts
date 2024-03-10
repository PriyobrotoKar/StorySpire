import { NextResponse } from "next/server";

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

export const errResponse = (
  message: string,
  {
    title,
    description,
    field,
  }: { title: string; description: string; field: string },
  status: number
) => {
  return NextResponse.json(
    {
      error: {
        title: title || "Internal Server Error",
        description:
          description || "There's a problem connecting to the server",
        field: field,
      },
    },
    { status }
  );
};
