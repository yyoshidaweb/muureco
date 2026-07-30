"use client";

import { useCallback, useEffect, useState } from "react";
import { ArtistInputForm } from "@/components/ArtistInputForm";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { RecommendationList } from "@/components/RecommendationList";
import type { DiagnoseResult } from "@/lib/diagnose";
import { useLocale } from "@/lib/i18n";

type DiagnoseErrorBody = {
  error?: string;
  artist?: string;
};

type UiError =
  | { kind: "badRequest" }
  | { kind: "artistNotFound" }
  | { kind: "artistNotFoundNamed"; artist: string }
  | { kind: "diagnoseFailed" };

export default function Home() {
  const { t, lastfmUrl } = useLocale();
  const [artists, setArtists] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<UiError | null>(null);
  const [result, setResult] = useState<DiagnoseResult | null>(null);

  const handleArtistsChange = useCallback((next: string[]) => {
    setArtists(next);
    setError(null);
    if (next.length === 0) {
      setIsLoading(false);
      setResult(null);
      return;
    }
    setIsLoading(true);
    setResult(null);
  }, []);

  useEffect(() => {
    if (artists.length === 0) {
      return;
    }

    const controller = new AbortController();

    async function diagnose() {
      try {
        const response = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ artists }),
          signal: controller.signal,
        });

        const body = (await response.json().catch(() => null)) as
          | DiagnoseResult
          | DiagnoseErrorBody
          | null;

        if (!response.ok) {
          if (response.status === 400) {
            setError({ kind: "badRequest" });
          } else if (response.status === 404) {
            const artist =
              body && "artist" in body && typeof body.artist === "string"
                ? body.artist
                : null;
            setError(
              artist
                ? { kind: "artistNotFoundNamed", artist }
                : { kind: "artistNotFound" },
            );
          } else {
            setError({ kind: "diagnoseFailed" });
          }
          return;
        }

        if (
          !body ||
          !("diagnosis" in body) ||
          !("recommendations" in body) ||
          !Array.isArray(body.diagnosis) ||
          !Array.isArray(body.recommendations)
        ) {
          setError({ kind: "diagnoseFailed" });
          return;
        }

        setResult(body);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return;
        }
        setError({ kind: "diagnoseFailed" });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void diagnose();

    return () => {
      controller.abort();
    };
  }, [artists]);

  const errorMessage =
    error === null
      ? null
      : error.kind === "badRequest"
        ? t("error.badRequest")
        : error.kind === "artistNotFound"
          ? t("error.artistNotFound")
          : error.kind === "artistNotFoundNamed"
            ? t("error.artistNotFoundNamed", { artist: error.artist })
            : t("error.diagnoseFailed");

  return (
    <div className="flex flex-1 flex-col bg-white">
      <header className="border-b border-neutral-200">
        <div className="mx-auto flex w-full max-w-5xl items-start justify-between gap-4 px-4 py-4 sm:px-6 sm:py-5">
          <div>
            <h1 className="text-[1.6875rem] font-bold tracking-tight text-black sm:text-[2.025rem]">
              {t("brand.name")}
            </h1>
            <p className="mt-1 text-sm text-neutral-600 sm:text-base">
              {t("brand.tagline")}
            </p>
          </div>
          <LanguageSwitcher />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
        <div className="flex flex-1 flex-col gap-[1ch] md:min-h-[360px] md:flex-row">
          <div className="flex flex-1 flex-col gap-2">
            <h2 className="text-lg font-medium text-black">
              {t("section.favoriteArtists")}
            </h2>
            <div className="flex flex-1 flex-col rounded-md border border-neutral-200 bg-white p-4 sm:p-6">
              <ArtistInputForm
                onArtistsChange={handleArtistsChange}
                error={errorMessage}
              />
            </div>
          </div>

          <div className="flex flex-1 flex-col gap-2">
            <h2 className="text-lg font-medium text-black">
              {t("section.recommendedArtists")}
            </h2>
            <div className="flex flex-1 flex-col rounded-md border border-neutral-200 bg-neutral-100 p-4 sm:p-6">
              <RecommendationList
                recommendations={result?.recommendations ?? null}
                tags={result?.diagnosis ?? null}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-neutral-200">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-1 px-4 py-6 text-sm text-neutral-500 sm:px-6">
          <p>
            {t("footer.developedBy")}
            <a
              href="https://piku.page/@yyoshidaweb"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-black"
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
              className="underline hover:text-black"
            >
              Last.fm
            </a>
            {t("footer.unofficial")}
          </p>
        </div>
      </footer>
    </div>
  );
}
