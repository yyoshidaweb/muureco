"use client";

import type { DiagnosisTag, Recommendation } from "@/lib/diagnose";
import { DiagnosisResult } from "@/components/DiagnosisResult";
import { useLocale } from "@/lib/i18n";

type RecommendationListProps = {
  recommendations: Recommendation[] | null;
  tags: DiagnosisTag[] | null;
  isLoading: boolean;
};

function ArtistPlaceholder() {
  return (
    <span
      className="flex size-10 shrink-0 items-center justify-center rounded bg-neutral-200 text-neutral-500"
      aria-hidden
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="size-5"
      >
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v1c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-1c0-2.66-5.33-4-8-4z" />
      </svg>
    </span>
  );
}

export function RecommendationList({
  recommendations,
  tags,
  isLoading,
}: RecommendationListProps) {
  const { t, lastfmUrl } = useLocale();

  return (
    <section className="flex h-full min-h-[240px] flex-col md:min-h-0">
      <div className="flex flex-1 flex-col gap-8">
        {isLoading && (
          <p className="text-sm text-neutral-500" aria-live="polite">
            {t("result.thinking")}
          </p>
        )}

        {!isLoading && recommendations && (
          <>
            {recommendations.length === 0 ? (
              <p className="text-sm text-neutral-500">
                {t("result.noRecommendations")}
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {recommendations.map((rec) => (
                  <li key={rec.mbid ?? rec.name}>
                    <a
                      href={lastfmUrl(rec.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md border border-neutral-300 bg-white px-4 py-3 text-black transition-colors hover:bg-neutral-50"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="flex min-w-0 items-center gap-3">
                          <ArtistPlaceholder />
                          <span className="truncate">{rec.name}</span>
                        </span>
                        <span className="shrink-0 text-sm text-neutral-500">
                          {t("link.lastfm")}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}

            {tags && <DiagnosisResult tags={tags} />}
          </>
        )}
      </div>
    </section>
  );
}
