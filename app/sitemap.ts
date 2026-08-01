import type { MetadataRoute } from "next";
import { LOCALE_PATHS, SITE_URL } from "@/lib/site";

const languages = {
  en: `${SITE_URL}${LOCALE_PATHS.en}`,
  ja: `${SITE_URL}${LOCALE_PATHS.ja}`,
  "x-default": `${SITE_URL}${LOCALE_PATHS.en}`,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${SITE_URL}${LOCALE_PATHS.en}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages },
    },
    {
      url: `${SITE_URL}${LOCALE_PATHS.ja}`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages },
    },
  ];
}
