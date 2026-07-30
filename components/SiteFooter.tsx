"use client";

import { localePath, useLocale } from "@/lib/i18n";

export function SiteFooter() {
  const { locale, t, lastfmUrl } = useLocale();

  return (
    <footer className="border-t border-neutral-200">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-neutral-500 sm:px-6">
        <p>
          {t("footer.developedBy")}
          <a
            href="https://piku.page/@yyoshidaweb"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-black"
          >
            @yyoshidaweb
          </a>
        </p>
        <p>
          {t("footer.dataProvider")}
          <a
            href={lastfmUrl("https://www.last.fm/")}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-black"
          >
            Last.fm
          </a>
          {t("footer.unofficial")}
        </p>
        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
          <a
            href={localePath(locale, "/terms")}
            className="underline hover:text-black"
          >
            {t("link.terms")}
          </a>
          <a
            href={localePath(locale, "/privacy")}
            className="underline hover:text-black"
          >
            {t("link.privacy")}
          </a>
        </div>
      </div>
    </footer>
  );
}
