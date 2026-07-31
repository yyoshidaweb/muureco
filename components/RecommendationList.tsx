"use client";

import Image from "next/image";
import { useState } from "react";
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
  const { t } = useLocale();
  // 開いているプレイヤーは常に1件だけにして、同時再生を防ぐ。
  const [openPreviewId, setOpenPreviewId] = useState<string | null>(null);
  const [shownRecommendations, setShownRecommendations] =
    useState(recommendations);

  // 診断をやり直したときに、前回開いていたプレイヤーを引き継がない。
  if (shownRecommendations !== recommendations) {
    setShownRecommendations(recommendations);
    setOpenPreviewId(null);
  }

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
                {recommendations.map((rec) => {
                  const spotifyId = rec.spotifyId;
                  const isOpen =
                    spotifyId != null && spotifyId === openPreviewId;
                  const panelId = `spotify-preview-${spotifyId}`;
                  // 代表曲が取れたときは1曲だけを、取れなかったときは
                  // アーティストの埋め込みを出す。
                  const embedPath = rec.spotifyTrackId
                    ? `track/${rec.spotifyTrackId}`
                    : `artist/${spotifyId}`;

                  return (
                    <li
                      key={rec.mbid ?? rec.name}
                      className="overflow-hidden rounded-md border border-neutral-300 bg-white text-black"
                    >
                      <div className="flex items-center gap-3 px-4 py-3">
                        {rec.imageUrl ? (
                          <Image
                            src={rec.imageUrl}
                            alt=""
                            width={40}
                            height={40}
                            // Spotify から取得するのは表示サイズに近い最小画像のため、
                            // 追加の最適化は行わずそのまま配信する。
                            unoptimized
                            className="size-10 shrink-0 rounded object-cover"
                          />
                        ) : (
                          <ArtistPlaceholder />
                        )}
                        <span className="min-w-0 flex-1 truncate">
                          {rec.name}
                        </span>
                        {spotifyId && (
                          <button
                            type="button"
                            onClick={() =>
                              setOpenPreviewId(isOpen ? null : spotifyId)
                            }
                            aria-expanded={isOpen}
                            // 閉じている間はプレイヤーを描画しないため、参照先も持たせない。
                            aria-controls={isOpen ? panelId : undefined}
                            aria-label={t("preview.toggleLabel", {
                              artist: rec.name,
                            })}
                            className="shrink-0 cursor-pointer rounded border border-neutral-300 px-2 py-1 text-sm text-neutral-600 transition-colors hover:bg-neutral-100"
                          >
                            {isOpen ? t("preview.close") : t("preview.open")}
                          </button>
                        )}
                      </div>
                      {isOpen && (
                        <div
                          id={panelId}
                          className="border-t border-neutral-200 p-3"
                        >
                          <iframe
                            title={t("preview.playerTitle", {
                              artist: rec.name,
                            })}
                            src={`https://open.spotify.com/embed/${embedPath}`}
                            width="100%"
                            height={152}
                            loading="lazy"
                            allow="clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                            className="w-full rounded-xl border-0"
                          />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}

            {tags && <DiagnosisResult tags={tags} />}
          </>
        )}
      </div>
    </section>
  );
}
