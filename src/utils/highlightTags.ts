import { Tag } from "../models/Tag";

// при редактировании не переходит на новую строку
// отредактировать регулярки

export const highlightTags = (text: string) => {
  let cleanText: string = text.replace(/<("[^"]*"|'[^']*'|[^'">])*>/gm, "");

  const tags = parseTags(cleanText);

  for (let tag of tags) {
    cleanText = cleanText.replace(
      ` #${tag.name}`,
      ` <span class="highlight">#${tag.name}</span>`
    );
  }

  return { highlightHtml: cleanText, tags };
};

export const parseTags = (text: string) => {
  const matches: string[] = text.match(/(?<=\s#)\w+/gm) || [];
  const tags: Tag[] = matches.map((item) => ({
    name: item,
    count: 1,
    isActive: false,
    color: "primary",
  }));
  return tags;
};
