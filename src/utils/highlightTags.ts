import { Tag } from "../models/Tag";

export const highlightTags = (text: string) => {
  let cleanText: string = text
    .replace(/<(span|\/span)("[^"]*"|'[^']*'|[^'">])*>/gm, "")
    .replace(/[\r\n]+/gm, "<br>");

  const tags = parseTags(cleanText);

  for (let tag of tags) {
    cleanText = cleanText.replace(
      `#${tag.name}`,
      `<span class="highlight">#${tag.name}</span>`
    );
  }

  return { highlightHtml: cleanText, tags };
};

export const parseTags = (text: string) => {
  const matches: string[] = text.match(/((?<=\s#)|(?<=>#))\w+/gm) || [];
  const tags: Tag[] = matches.map((item) => ({
    name: item,
    count: 1,
    color: "primary",
  }));
  return tags;
};
