"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { localizeLastfmUrl } from "./lastfm-url";
import { localePath } from "./locale";
import { translate, type TranslateParams } from "./translate";
import type { Locale, TranslationKey } from "./types";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: TranslateParams) => string;
  lastfmUrl: (url: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      router.push(localePath(next, pathname));
    },
    [locale, pathname, router],
  );

  const t = useCallback(
    (key: TranslationKey, params?: TranslateParams) =>
      translate(locale, key, params),
    [locale],
  );

  const lastfmUrl = useCallback(
    (url: string) => localizeLastfmUrl(url, locale),
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, lastfmUrl }),
    [locale, setLocale, t, lastfmUrl],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
