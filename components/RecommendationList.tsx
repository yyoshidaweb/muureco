import type { DiagnosisTag, Recommendation } from "@/lib/diagnose";
import { DiagnosisResult } from "@/components/DiagnosisResult";

type RecommendationListProps = {
  recommendations: Recommendation[] | null;
  tags: DiagnosisTag[] | null;
  isLoading: boolean;
};

function ArtistImage({ name, imageUrl }: { name: string; imageUrl?: string }) {
  if (imageUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- Last.fm CDN URL; next/image remote config not used
      <img
        src={imageUrl}
        alt=""
        width={40}
        height={40}
        className="size-10 shrink-0 rounded object-cover"
      />
    );
  }

  return (
    <span
      className="flex size-10 shrink-0 items-center justify-center rounded bg-neutral-200 text-sm font-medium text-neutral-500"
      aria-hidden
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}

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
            考え中...
          </p>
        )}

        {!isLoading && recommendations && (
          <>
            {recommendations.length === 0 ? (
              <p className="text-sm text-neutral-500">
                おすすめアーティストが見つかりませんでした
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {recommendations.map((rec) => (
                  <li key={rec.mbid ?? rec.name}>
                    <a
                      href={rec.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block rounded-md border border-neutral-300 bg-white px-4 py-3 text-black transition-colors hover:bg-neutral-50"
                    >
                      <span className="flex items-center justify-between gap-3">
                        <span className="flex min-w-0 items-center gap-3">
                          <ArtistImage
                            name={rec.name}
                            imageUrl={rec.imageUrl}
                          />
                          <span className="truncate">{rec.name}</span>
                        </span>
                        <span className="shrink-0 text-sm text-neutral-500">
                          Last.fm ↗
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
