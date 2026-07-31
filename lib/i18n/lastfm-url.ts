import type { Locale } from "./types";

/** Last.fm site language path prefixes (excluding English default). */
const LASTFM_LANG_PREFIXES = new Set([
  "de",
  "es",
  "fr",
  "it",
  "ja",
  "pl",
  "pt",
  "ru",
  "sv",
  "tr",
  "zh",
]);

/**
 * Rewrite a Last.fm URL for the given UI locale.
 * Japanese uses `/ja/...`; English uses the default (no language prefix).
 */
export function localizeLastfmUrl(url: string, locale: Locale): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (parsed.hostname !== "www.last.fm" && parsed.hostname !== "last.fm") {
    return url;
  }

  parsed.hostname = "www.last.fm";

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments.length > 0 && LASTFM_LANG_PREFIXES.has(segments[0])) {
    segments.shift();
  }

  if (locale === "ja") {
    segments.unshift("ja");
  }

  parsed.pathname = segments.length > 0 ? `/${segments.join("/")}` : "/";

  // Preserve trailing slash for the localized homepage only.
  if (segments.length === 1 && locale === "ja" && url.endsWith("/")) {
    parsed.pathname = "/ja/";
  } else if (segments.length === 0) {
    parsed.pathname = "/";
  }

  return parsed.toString();
}
