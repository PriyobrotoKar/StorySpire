export const extractDomain = (link: string) => {
  if (!link.includes("https") && link.indexOf("@") < link.indexOf(".com")) {
    return "mail";
  }

  const url = new URL(link).hostname;
  const startInd = url.indexOf(".") + 1;
  const endInd = url.indexOf(".", url.indexOf(".") + 1);

  if (endInd === -1) {
    return url.slice(0, startInd - 1);
  }

  return url.substring(startInd, endInd);
};
