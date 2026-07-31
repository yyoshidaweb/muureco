"use client";

import {
  LOCALES,
  useLocale,
  type Locale,
  type TranslationKey,
} from "@/lib/i18n";

const LOCALE_LABEL_KEYS: Record<Locale, TranslationKey> = {
  ja: "language.ja",
  en: "language.en",
};

function GlobeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4 shrink-0 text-neutral-600"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14.5 14.5 0 0 1 0 18" />
      <path d="M12 3a14.5 14.5 0 0 0 0 18" />
    </svg>
  );
}

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="flex items-center gap-1.5 text-sm">
      <GlobeIcon />
      <label htmlFor="language-switcher" className="sr-only">
        {t("language.label")}
      </label>
      <select
        id="language-switcher"
        value={locale}
        onChange={(event) => setLocale(event.target.value as Locale)}
        className="cursor-pointer border border-neutral-300 bg-white px-2 py-1 text-sm text-black focus:border-black focus:outline-none"
      >
        {LOCALES.map((code) => (
          <option key={code} value={code}>
            {t(LOCALE_LABEL_KEYS[code])}
          </option>
        ))}
      </select>
    </div>
  );
}
