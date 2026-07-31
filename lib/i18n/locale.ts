import { DEFAULT_LOCALE, LOCALES, type Locale } from "./types";

export const LOCALE_COOKIE = "muureco-locale";

export function isLocale(value: unknown): value is Locale {
  return (
    typeof value === "string" && (LOCALES as readonly string[]).includes(value)
  );
}

export function parseLocale(value: unknown): Locale | null {
  return isLocale(value) ? value : null;
}

/**
 * Build the public path for a locale.
 * English has no prefix (`/`); Japanese uses `/ja`.
 */
export function localePath(locale: Locale, pathname = ""): string {
  const rest = pathname
    .replace(/^\/(ja|en)(?=\/|$)/, "")
    .replace(/^\/+|\/+$/g, "");
  const suffix = rest ? `/${rest}` : "";

  if (locale === "en") {
    return suffix || "/";
  }
  return `/ja${suffix}`;
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

/** Locale encoded in the public URL (`/ja` → ja, otherwise en). */
export function resolveLocaleFromPathname(pathname: string): Locale {
  const segment = pathname.split("/").filter(Boolean)[0];
  return segment === "ja" ? "ja" : "en";
}

export function writeLocaleCookie(locale: Locale): void {
  if (typeof document === "undefined") return;
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

export { DEFAULT_LOCALE };
