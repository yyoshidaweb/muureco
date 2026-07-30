import {
  DEFAULT_LOCALE,
  LOCALES,
  type Locale,
} from "./types";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function parseLocale(value: unknown): Locale | null {
  return isLocale(value) ? value : null;
}

/** Build the localized app path for a locale (e.g. `/ja`, `/en`). */
export function localePath(locale: Locale, pathname = ""): string {
  const rest = pathname.replace(/^\/(ja|en)(?=\/|$)/, "").replace(/\/$/, "");
  if (!rest || rest === "/") {
    return `/${locale}`;
  }
  return `/${locale}${rest.startsWith("/") ? rest : `/${rest}`}`;
}

/**
 * Detect locale from country / Accept-Language.
 * Japan → ja; otherwise → en. Unknown country falls back to Accept-Language.
 */
export function detectLocaleFromHeaders(headers: Headers): Locale {
  const country = (
    headers.get("cf-ipcountry") ??
    headers.get("x-vercel-ip-country") ??
    headers.get("x-country-code") ??
    ""
  ).toUpperCase();

  if (country === "JP") {
    return "ja";
  }

  // Cloudflare uses XX for unknown; T1 for Tor. Treat those as unknown.
  if (country && country !== "XX" && country !== "T1") {
    return "en";
  }

  const acceptLanguage = headers.get("accept-language")?.toLowerCase() ?? "";
  if (acceptLanguage.includes("ja")) {
    return "ja";
  }

  return "en";
}

export function resolveLocaleFromPathname(pathname: string): Locale | null {
  const segment = pathname.split("/").filter(Boolean)[0];
  return parseLocale(segment);
}

export { DEFAULT_LOCALE };
