export const extractDomain = (link: string) => {
  const host = link.substring(link.indexOf("/", 7) + 1, link.indexOf("/", 8));

  return host
    .match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\.\n]+)/im)
    ?.at(1);
};
