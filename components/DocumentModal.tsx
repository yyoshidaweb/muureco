"use client";

import { useEffect, useId, useRef } from "react";
import { DocumentBody } from "@/components/DocumentBody";
import type { ContentDocument } from "@/lib/content/types";
import { useLocale } from "@/lib/i18n";

type DocumentModalProps = {
  document: ContentDocument;
  onClose: () => void;
};

export function DocumentModal({ document, onClose }: DocumentModalProps) {
  const { t } = useLocale();
  const titleId = useId();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = window.document.body.style.overflow;
    window.document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex max-h-[min(90vh,880px)] w-full max-w-3xl flex-col overflow-hidden rounded-lg bg-white shadow-lg"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-end border-b border-neutral-200 bg-white px-3 py-2">
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label={t("modal.close")}
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded text-2xl leading-none text-neutral-600 hover:bg-neutral-100 hover:text-black focus:outline-none focus-visible:ring-2 focus-visible:ring-black"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto">
          <DocumentBody document={document} titleId={titleId} />
        </div>
      </div>
    </div>
  );
}
