import { Metadata } from "next";

const globalMetadata: Metadata = {
  title: {
    template: `%s | StorySpire`,
    default: "StorySpire",
  },
  description:
    "Unlock the power of storytelling with StorySpire - your ultimate blogging companion. Craft captivating narratives, share your voice, and engage your audience effortlessly. With intuitive features and seamless design, StorySpire empowers bloggers to ignite creativity and build connections.",

  twitter: {
    card: "summary_large_image",
  },
};
export default globalMetadata;
