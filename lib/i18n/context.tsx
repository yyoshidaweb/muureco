"use client";

import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { localizeLastfmUrl } from "./lastfm-url";
import { localePath, writeLocaleCookie } from "./locale";
import { translate, type TranslateParams } from "./translate";
import type { Locale, TranslationKey } from "./types";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: TranslateParams) => string;
  lastfmUrl: (url: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function LocaleProviderInner({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      writeLocaleCookie(next);
      const query = searchParams.toString();
      const nextPath = localePath(next, pathname);
      router.push(query ? `${nextPath}?${query}` : nextPath);
    },
    [locale, pathname, router, searchParams],
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

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <Suspense fallback={null}>
      <LocaleProviderInner locale={locale}>{children}</LocaleProviderInner>
    </Suspense>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
