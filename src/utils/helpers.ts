export const readingTime = (words: number) => {
  const wpm = 225;
  return Math.ceil(words / wpm);
};

export const formatDate = (date: Date) => {
  console.log("server");
  return new Date(date).toLocaleDateString("en-GB", {
    dateStyle: "medium",
  });
};

export const capitalize = (text: string) => {
  return text[0].toUpperCase() + text.slice(1);
};
