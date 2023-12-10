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
