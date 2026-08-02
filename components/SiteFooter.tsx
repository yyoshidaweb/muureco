"use client";

import { Suspense, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DocumentModal } from "@/components/DocumentModal";
import { algorithmContent } from "@/lib/algorithm/content";
import { creditsContent } from "@/lib/credits/content";
import { useLocale } from "@/lib/i18n";
import { CONTACT_URL, privacyContent, termsContent } from "@/lib/legal/content";

const LEGAL_QUERY = "legal";
const ABOUT_QUERY = "about";
const EXTERNAL_LINK_MARK = "↗︎";

type LegalKind = "terms" | "privacy";
type AboutKind = "algorithm" | "credits";
type ModalKind = LegalKind | AboutKind;

function parseLegalQuery(value: string | null): LegalKind | null {
  if (value === "terms" || value === "privacy") {
    return value;
  }
  return null;
}

function parseAboutQuery(value: string | null): AboutKind | null {
  if (value === "algorithm" || value === "credits") {
    return value;
  }
  return null;
}

function SiteFooterContent() {
  const { locale, t } = useLocale();
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
      if (kind === "algorithm" || kind === "credits") {
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
          : openAbout === "credits"
            ? creditsContent[locale]
            : null;

  return (
    <>
      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-neutral-500 sm:px-6">
          <div className="flex flex-wrap gap-x-4 gap-y-1">
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
            <button
              type="button"
              onClick={() => setModalQuery("credits")}
              className="cursor-pointer underline hover:text-black"
            >
              {t("link.credits")}
            </button>
            <a
              href={CONTACT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer underline hover:text-black"
            >
              {t("link.contact")}
              {EXTERNAL_LINK_MARK}
            </a>
          </div>
          <p className="mt-1 inline-flex flex-wrap items-center gap-1.5">
            <span>{t("footer.developedBy")}</span>
            <a
              href="https://piku.page/@yyoshidaweb"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-0.5 underline hover:text-black"
            >
              <img
                src="/yyoshidaweb-icon.png"
                alt=""
                width={20}
                height={20}
                className="size-5 rounded-full"
                decoding="async"
              />
              <span>
                @yyoshidaweb
                {EXTERNAL_LINK_MARK}
              </span>
            </a>
          </p>
          <div className="mt-1">
            <p>{t("footer.otherServices")}</p>
            <ul className="mt-1 list-disc pl-5">
              <li>
                <a
                  href="https://minnanotimetable.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cursor-pointer underline hover:text-black"
                >
                  {t("footer.minnanotimetable")}
                  {EXTERNAL_LINK_MARK}
                </a>
              </li>
            </ul>
          </div>
          <p className="mt-1">
            © {new Date().getFullYear()} ミューレコ（Muureco）
          </p>
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
