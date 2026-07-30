"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { localizeLastfmUrl } from "./lastfm-url";
import {
  resolveInitialLocale,
  writeStoredLocale,
} from "./locale";
import { translate, type TranslateParams } from "./translate";
import { DEFAULT_LOCALE, type Locale, type TranslationKey } from "./types";

const LOCALE_CHANGE_EVENT = "muureco-locale-change";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey, params?: TranslateParams) => string;
  lastfmUrl: (url: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function subscribe(onStoreChange: () => void): () => void {
  window.addEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(LOCALE_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

function getLocaleSnapshot(): Locale {
  return resolveInitialLocale(new URLSearchParams(window.location.search));
}

function getServerLocaleSnapshot(): Locale {
  return DEFAULT_LOCALE;
}

function applyLocaleToUrl(locale: Locale): void {
  const url = new URL(window.location.href);
  if (locale === DEFAULT_LOCALE) {
    url.searchParams.delete("lang");
  } else {
    url.searchParams.set("lang", locale);
  }
  window.history.replaceState(null, "", url);
}

function notifyLocaleChange(): void {
  window.dispatchEvent(new Event(LOCALE_CHANGE_EVENT));
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(
    subscribe,
    getLocaleSnapshot,
    getServerLocaleSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = locale;
    writeStoredLocale(locale);
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    writeStoredLocale(next);
    applyLocaleToUrl(next);
    notifyLocaleChange();
  }, []);

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
