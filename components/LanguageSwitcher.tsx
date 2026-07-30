"use client";

import { LOCALES, useLocale, type Locale, type TranslationKey } from "@/lib/i18n";

const LOCALE_LABEL_KEYS: Record<Locale, TranslationKey> = {
  ja: "language.ja",
  en: "language.en",
};

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className="flex items-center gap-2 text-sm">
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
