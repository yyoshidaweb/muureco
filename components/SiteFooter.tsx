"use client";

import { Suspense, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DocumentModal } from "@/components/DocumentModal";
import { algorithmContent } from "@/lib/algorithm/content";
import { useLocale } from "@/lib/i18n";
import { privacyContent, termsContent } from "@/lib/legal/content";

const LEGAL_QUERY = "legal";
const ABOUT_QUERY = "about";

type LegalKind = "terms" | "privacy";
type AboutKind = "algorithm";
type ModalKind = LegalKind | AboutKind;

function parseLegalQuery(value: string | null): LegalKind | null {
  if (value === "terms" || value === "privacy") {
    return value;
  }
  return null;
}

function parseAboutQuery(value: string | null): AboutKind | null {
  if (value === "algorithm") {
    return value;
  }
  return null;
}

function SiteFooterContent() {
  const { locale, t, lastfmUrl } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const openLegal = parseLegalQuery(searchParams.get(LEGAL_QUERY));
  const openAbout = parseAboutQuery(searchParams.get(ABOUT_QUERY));

  const setModalQuery = useCallback(
    (kind: ModalKind | null) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(LEGAL_QUERY);
      params.delete(ABOUT_QUERY);
      if (kind === "algorithm") {
        params.set(ABOUT_QUERY, kind);
      } else if (kind) {
        params.set(LEGAL_QUERY, kind);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const openDocument =
    openLegal === "terms"
      ? termsContent[locale]
      : openLegal === "privacy"
        ? privacyContent[locale]
        : openAbout === "algorithm"
          ? algorithmContent[locale]
          : null;

  return (
    <>
      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-neutral-500 sm:px-6">
          <p>
            {t("footer.developedBy")}
            <a
              href="https://piku.page/@yyoshidaweb"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer underline hover:text-black"
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
              className="cursor-pointer underline hover:text-black"
            >
              Last.fm
            </a>
            {t("footer.unofficial")}
          </p>
          <p>
            {t("footer.previewProvider")}
            <a
              href="https://www.apple.com/apple-music/"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer underline hover:text-black"
            >
              Apple Music
            </a>
            {t("footer.unofficial")}
          </p>
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            <button
              type="button"
              onClick={() => setModalQuery("algorithm")}
              className="cursor-pointer underline hover:text-black"
            >
              {t("link.algorithm")}
            </button>
            <button
              type="button"
              onClick={() => setModalQuery("terms")}
              className="cursor-pointer underline hover:text-black"
            >
              {t("link.terms")}
            </button>
            <button
              type="button"
              onClick={() => setModalQuery("privacy")}
              className="cursor-pointer underline hover:text-black"
            >
              {t("link.privacy")}
            </button>
          </div>
        </div>
      </footer>

      {openDocument ? (
        <DocumentModal
          document={openDocument}
          onClose={() => setModalQuery(null)}
        />
      ) : null}
    </>
  );
}

export function SiteFooter() {
  return (
    <Suspense fallback={null}>
      <SiteFooterContent />
    </Suspense>
  );
}
