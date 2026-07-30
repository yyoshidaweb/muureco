import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "./types";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function parseLocale(value: unknown): Locale | null {
  return isLocale(value) ? value : null;
}

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return parseLocale(window.localStorage.getItem(LOCALE_STORAGE_KEY));
  } catch {
    return null;
  }
}

export function writeStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // Ignore quota / private mode failures.
  }
}

export function resolveInitialLocale(searchParams?: URLSearchParams): Locale {
  const fromQuery = searchParams
    ? parseLocale(searchParams.get("lang"))
    : null;
  if (fromQuery) {
    return fromQuery;
  }
  return readStoredLocale() ?? DEFAULT_LOCALE;
}
