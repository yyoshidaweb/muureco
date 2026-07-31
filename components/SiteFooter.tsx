"use client";

import { Suspense, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DocumentModal } from "@/components/DocumentModal";
import { useLocale } from "@/lib/i18n";
import { privacyContent, termsContent } from "@/lib/legal/content";

const LEGAL_QUERY = "legal";

type LegalKind = "terms" | "privacy";

function parseLegalQuery(value: string | null): LegalKind | null {
  if (value === "terms" || value === "privacy") {
    return value;
  }
  return null;
}

function SiteFooterContent() {
  const { locale, t, lastfmUrl } = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const openModal = parseLegalQuery(searchParams.get(LEGAL_QUERY));

  const setLegalQuery = useCallback(
    (kind: LegalKind | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (kind) {
        params.set(LEGAL_QUERY, kind);
      } else {
        params.delete(LEGAL_QUERY);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const legalDocument =
    openModal === "terms"
      ? termsContent[locale]
      : openModal === "privacy"
        ? privacyContent[locale]
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
          <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            <button
              type="button"
              onClick={() => setLegalQuery("terms")}
              className="cursor-pointer underline hover:text-black"
            >
              {t("link.terms")}
            </button>
            <button
              type="button"
              onClick={() => setLegalQuery("privacy")}
              className="cursor-pointer underline hover:text-black"
            >
              {t("link.privacy")}
            </button>
          </div>
        </div>
      </footer>

      {legalDocument ? (
        <DocumentModal
          document={legalDocument}
          onClose={() => setLegalQuery(null)}
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
