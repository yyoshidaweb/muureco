import type { MetadataRoute } from "next";
import { localeUrl } from "@/lib/site";

const languages = {
  en: localeUrl("en"),
  ja: localeUrl("ja"),
  "x-default": localeUrl("en"),
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: localeUrl("en"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: localeUrl("ja"),
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages },
    },
  ];
}
