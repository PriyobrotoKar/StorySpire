export const extractDomain = (link: string) => {
  if (!link.includes("https") && link.indexOf("@") < link.indexOf(".com")) {
    return "mail";
  }

  const host = link.substring(link.indexOf("/", 7) + 1, link.indexOf("/", 8));

  return host
    .match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\.\n]+)/im)
    ?.at(1);
};
