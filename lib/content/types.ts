export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "link"; label: string; href: string };

export type ContentSection = {
  heading: string;
  blocks: ContentBlock[];
};

export type ContentDocument = {
  title: string;
  preamble: string[];
  sections: ContentSection[];
  closing: string[];
};
