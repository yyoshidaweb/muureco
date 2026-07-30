import { dictionaries } from "./dictionaries";
import type { Locale, TranslationKey } from "./types";

export type TranslateParams = Record<string, string | number>;

export function translate(
  locale: Locale,
  key: TranslationKey,
  params?: TranslateParams,
): string {
  const template = dictionaries[locale][key];
  if (!params) {
    return template;
  }
  return template.replace(/\{(\w+)\}/g, (_, name: string) => {
    const value = params[name];
    return value === undefined ? `{${name}}` : String(value);
  });
}
