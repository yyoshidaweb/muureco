"use client";

import { useEffect, useRef, useState } from "react";
import type { DiagnosisTag, Recommendation } from "@/lib/diagnose";
import { DiagnosisResult } from "@/components/DiagnosisResult";
import { type Locale, useLocale } from "@/lib/i18n";

type RecommendationListProps = {
  recommendations: Recommendation[] | null;
  tags: DiagnosisTag[] | null;
  isLoading: boolean;
};

/**
 * Apple 配布の「Listen on Apple Music」バッジ。加工・自作は禁止されているため、
 * 配布物をそのまま置いて寸法だけガイドラインに合わせる。
 */
const APPLE_MUSIC_BADGES: Record<Locale, { src: string; width: number }> = {
  ja: { src: "/apple-music-badge-ja.svg", width: 105 },
  en: { src: "/apple-music-badge-en.svg", width: 103 },
};

/** ガイドラインが定めるデジタル表示の最小の高さ。 */
const APPLE_MUSIC_BADGE_HEIGHT = 30;

/** Google Material Icons の play_circle。 */
function PlayCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden>
      <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M9.5,14.67V9.33c0-0.79,0.88-1.27,1.54-0.84l4.15,2.67c0.61,0.39,0.61,1.29,0,1.68l-4.15,2.67C10.38,15.94,9.5,15.46,9.5,14.67z" />
    </svg>
  );
}

/** Google Material Icons の stop_circle。 */
function StopCircleIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden>
      {/* 円と四角が同じ巻き方向のため、四角を抜くには evenodd が必要。 */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9,16h6c0.55,0,1-0.45,1-1V9c0-0.55-0.45-1-1-1H9C8.45,8,8,8.45,8,9v6C8,15.55,8.45,16,9,16z M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2L12,2z"
      />
    </svg>
  );
}

export function RecommendationList({
  recommendations,
  tags,
  isLoading,
}: RecommendationListProps) {
  const { locale, t } = useLocale();
  const badge = APPLE_MUSIC_BADGES[locale];
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
      // 一時停止ではなく停止として扱い、次の再生は曲の頭から始める。
      audio.pause();
      audio.currentTime = 0;
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
                      <div className="rounded-md border border-neutral-300 bg-white px-4 py-3 text-black">
                        <div className="flex items-center">
                          <span className="truncate">{rec.name}</span>
                        </div>

                        {rec.preview && (
                          <div className="mt-1 flex flex-col gap-2 text-xs text-neutral-500">
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => void togglePreview(rec)}
                                aria-label={t(
                                  isPlaying
                                    ? "preview.stopLabel"
                                    : "preview.playLabel",
                                  { artist: rec.name },
                                )}
                                className="shrink-0 cursor-pointer transition-colors hover:text-black"
                              >
                                {isPlaying ? (
                                  <StopCircleIcon />
                                ) : (
                                  <PlayCircleIcon />
                                )}
                              </button>
                              <span
                                className="truncate text-sm"
                                aria-live="polite"
                              >
                                {hasFailed
                                  ? t("preview.failed")
                                  : rec.preview.trackName}
                              </span>
                              {!hasFailed && (
                                <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-neutral-600">
                                  {t("preview.label")}
                                </span>
                              )}
                            </div>

                            {/* 試聴音源の近くにストアへの導線を置くことが利用条項の条件。 */}
                            <a
                              href={rec.preview.storeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={t("preview.storeLabel", {
                                track: rec.preview.trackName,
                              })}
                              className="self-end"
                            >
                              {/* eslint-disable-next-line @next/next/no-img-element -- 加工禁止のバッジなので next/image で変換しない */}
                              <img
                                src={badge.src}
                                alt=""
                                width={badge.width}
                                height={APPLE_MUSIC_BADGE_HEIGHT}
                              />
                            </a>
                          </div>
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
