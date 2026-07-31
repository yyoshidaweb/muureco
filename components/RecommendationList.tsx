"use client";

import { useEffect, useRef, useState } from "react";
import type { DiagnosisTag, Recommendation } from "@/lib/diagnose";
import { DiagnosisResult } from "@/components/DiagnosisResult";
import { useLocale } from "@/lib/i18n";

type RecommendationListProps = {
  recommendations: Recommendation[] | null;
  tags: DiagnosisTag[] | null;
  isLoading: boolean;
};

/** Google Material Icons の play_circle。 */
function PlayCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden>
      <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M9.5,14.67V9.33c0-0.79,0.88-1.27,1.54-0.84l4.15,2.67c0.61,0.39,0.61,1.29,0,1.68l-4.15,2.67C10.38,15.94,9.5,15.46,9.5,14.67z" />
    </svg>
  );
}

/** Google Material Icons の pause_circle。 */
function PauseCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden>
      <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M10,16L10,16c-0.55,0-1-0.45-1-1V9c0-0.55,0.45-1,1-1l0,0c0.55,0,1,0.45,1,1v6C11,15.55,10.55,16,10,16z M14,16L14,16c-0.55,0-1-0.45-1-1V9c0-0.55,0.45-1,1-1l0,0c0.55,0,1,0.45,1,1v6C15,15.55,14.55,16,14,16z" />
    </svg>
  );
}

export function RecommendationList({
  recommendations,
  tags,
  isLoading,
}: RecommendationListProps) {
  const { t } = useLocale();
  const audioRef = useRef<HTMLAudioElement>(null);
  // audio 要素の error はどの行の失敗か持たないため、要求した行を覚えておく。
  const requestedName = useRef<string | null>(null);
  const [playingName, setPlayingName] = useState<string | null>(null);
  const [failedName, setFailedName] = useState<string | null>(null);
  const [shownRecommendations, setShownRecommendations] =
    useState(recommendations);

  if (shownRecommendations !== recommendations) {
    // 診断をやり直したら、前回の再生表示を持ち越さない。
    setShownRecommendations(recommendations);
    setPlayingName(null);
    setFailedName(null);
  }

  useEffect(() => {
    // 表示を戻すだけでは音が鳴り続けるため、要素も止める。
    audioRef.current?.pause();
  }, [recommendations]);

  async function togglePreview(recommendation: Recommendation) {
    const audio = audioRef.current;
    if (!audio || !recommendation.preview) {
      return;
    }

    if (playingName === recommendation.name) {
      audio.pause();
      setPlayingName(null);
      return;
    }

    requestedName.current = recommendation.name;
    setFailedName(null);
    // 同じ要素を使い回すことで、別の行を再生すると前の再生が必ず止まる。
    audio.src = recommendation.preview.url;

    try {
      await audio.play();
      setPlayingName(recommendation.name);
    } catch {
      setPlayingName(null);
      setFailedName(recommendation.name);
    }
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
                  const isPlaying = playingName === rec.name;
                  const hasFailed = failedName === rec.name;

                  return (
                    <li key={rec.mbid ?? rec.name}>
                      <div className="rounded-md border border-neutral-300 bg-white text-black">
                        <div className="flex items-center justify-between gap-3 px-4 py-3">
                          <span className="truncate">{rec.name}</span>
                          {rec.preview && (
                            <button
                              type="button"
                              onClick={() => void togglePreview(rec)}
                              aria-label={t(
                                isPlaying
                                  ? "preview.stopLabel"
                                  : "preview.playLabel",
                                { artist: rec.name },
                              )}
                              className="flex shrink-0 cursor-pointer items-center gap-1 text-sm text-neutral-500 transition-colors hover:text-black"
                            >
                              {isPlaying ? (
                                <PauseCircleIcon />
                              ) : (
                                <PlayCircleIcon />
                              )}
                              {t(isPlaying ? "preview.stop" : "preview.play")}
                            </button>
                          )}
                        </div>

                        {(isPlaying || hasFailed) && (
                          <p
                            className="truncate border-t border-neutral-200 px-4 py-2 text-sm text-neutral-500"
                            aria-live="polite"
                          >
                            {isPlaying && rec.preview
                              ? t("preview.playing", {
                                  track: rec.preview.trackName,
                                })
                              : t("preview.failed")}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {tags && <DiagnosisResult tags={tags} />}
          </>
        )}
      </div>

      <audio
        ref={audioRef}
        className="hidden"
        preload="none"
        onEnded={() => setPlayingName(null)}
        onError={() => {
          setPlayingName(null);
          setFailedName(requestedName.current);
        }}
      />
    </section>
  );
}
