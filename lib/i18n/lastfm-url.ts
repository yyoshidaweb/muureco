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
 * Normalize a Last.fm URL to the default (English) path.
 *
 * Do not add locale prefixes such as `/ja/`. Last.fm currently returns HTTP 502
 * for Japanese artist pages (`/ja/music/...`), so linking to localized paths
 * breaks outbound navigation from Muureco.
 *
 * The `locale` argument is kept for call-site compatibility but is unused.
 */
export function localizeLastfmUrl(url: string, _locale: Locale): string {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }

  if (
    parsed.hostname !== "www.last.fm" &&
    parsed.hostname !== "last.fm"
  ) {
    return url;
  }

  parsed.hostname = "www.last.fm";

  const segments = parsed.pathname.split("/").filter(Boolean);
  if (segments.length > 0 && LASTFM_LANG_PREFIXES.has(segments[0])) {
    segments.shift();
  }

  parsed.pathname = segments.length > 0 ? `/${segments.join("/")}` : "/";

  return parsed.toString();
}
