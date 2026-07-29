import type { DiagnosisTag, Recommendation } from "@/lib/diagnose";
import { DiagnosisResult } from "@/components/DiagnosisResult";

type RecommendationListProps = {
  recommendations: Recommendation[] | null;
  tags: DiagnosisTag[] | null;
  isLoading: boolean;
};

export function RecommendationList({
  recommendations,
  tags,
  isLoading,
}: RecommendationListProps) {
  return (
    <section className="flex h-full min-h-[240px] flex-col md:min-h-0">
      <div className="flex flex-1 flex-col gap-8">
        {isLoading && (
          <p className="text-sm text-neutral-500" aria-live="polite">
            診断中...
          </p>
        )}

        {!isLoading && recommendations && (
          <>
            {recommendations.length === 0 ? (
              <p className="text-sm text-neutral-500">
                おすすめアーティストが見つかりませんでした
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-neutral-300 border-y border-neutral-300">
                {recommendations.map((rec) => (
                  <li key={rec.mbid ?? rec.name}>
                    <a
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 py-3 text-black hover:underline"
                    >
                      <span>{rec.name}</span>
                      <span className="shrink-0 text-sm text-neutral-500">
                        Last.fm ↗
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
