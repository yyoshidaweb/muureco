import type { Locale } from "@/lib/i18n";

export const SITE_URL = "https://muureco.com";

/** Public paths per locale. Japanese uses a `/ja` prefix, English is unprefixed. */
export const LOCALE_PATHS: Record<Locale, string> = {
  ja: "/ja",
  en: "/",
};

/** Absolute URL for a locale, without a trailing slash on the root path. */
export function localeUrl(locale: Locale): string {
  const path = LOCALE_PATHS[locale];
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}
