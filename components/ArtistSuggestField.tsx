"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale } from "@/lib/i18n";

export type ArtistSuggestion = {
  name: string;
  mbid?: string;
};

type ArtistSuggestFieldProps = {
  query: string;
  selected: string | null;
  onQueryChange: (query: string) => void;
  onSelect: (artist: ArtistSuggestion) => void;
  excludedNames: string[];
  disabled?: boolean;
  "aria-label": string;
};

type SearchState =
  | { status: "idle" }
  | { status: "loading"; query: string }
  | { status: "done"; query: string; artists: ArtistSuggestion[] }
  | { status: "error"; query: string };

const DEBOUNCE_MS = 300;

export function ArtistSuggestField({
  query,
  selected,
  onQueryChange,
  onSelect,
  excludedNames,
  disabled = false,
  "aria-label": ariaLabel,
}: ArtistSuggestFieldProps) {
  const { t } = useLocale();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const [searchState, setSearchState] = useState<SearchState>({
    status: "idle",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const trimmedQuery = query.trim();
  const excluded = new Set(excludedNames.map((n) => n.trim().toLowerCase()));

  const matchedArtists =
    searchState.status === "done" && searchState.query === trimmedQuery
      ? searchState.artists
      : [];

  const visibleSuggestions = matchedArtists
    .filter((s) => !excluded.has(s.name.trim().toLowerCase()))
    .slice(0, 10);

  const isSearching =
    searchState.status === "loading" && searchState.query === trimmedQuery;

  const canShowSuggestions =
    selected === null &&
    !disabled &&
    trimmedQuery.length > 0 &&
    searchState.status !== "idle" &&
    searchState.query === trimmedQuery;

  const showList = isOpen && canShowSuggestions;

  useEffect(() => {
    if (selected !== null || disabled || !trimmedQuery) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setSearchState({ status: "loading", query: trimmedQuery });
      try {
        const response = await fetch(
          `/api/artists/search?q=${encodeURIComponent(trimmedQuery)}`,
          { signal: controller.signal },
        );
        if (!response.ok) {
          setSearchState({ status: "error", query: trimmedQuery });
          setIsOpen(true);
          return;
        }
        const body = (await response.json()) as {
          artists?: ArtistSuggestion[];
        };
        setSearchState({
          status: "done",
          query: trimmedQuery,
          artists: Array.isArray(body.artists) ? body.artists : [],
        });
        setIsOpen(true);
        setActiveIndex(-1);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setSearchState({ status: "error", query: trimmedQuery });
        setIsOpen(true);
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [trimmedQuery, selected, disabled]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  function selectSuggestion(artist: ArtistSuggestion) {
    onSelect(artist);
    setIsOpen(false);
    setSearchState({ status: "idle" });
    setActiveIndex(-1);
  }

  function handleQueryChange(value: string) {
    onQueryChange(value);
    if (!value.trim()) {
      setSearchState({ status: "idle" });
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!showList || visibleSuggestions.length === 0) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev < visibleSuggestions.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : visibleSuggestions.length - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();
      if (visibleSuggestions.length > 0) {
        const index = activeIndex >= 0 ? activeIndex : 0;
        selectSuggestion(visibleSuggestions[index]);
      }
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setIsOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative min-w-0 flex-1">
      <input
        type="text"
        value={query}
        onChange={(e) => handleQueryChange(e.target.value)}
        onFocus={() => {
          if (selected === null && trimmedQuery) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={t("form.artistPlaceholder")}
        aria-label={ariaLabel}
        aria-autocomplete="list"
        aria-expanded={showList}
        aria-controls={showList ? listboxId : undefined}
        role="combobox"
        autoComplete="off"
        className="w-full border border-neutral-300 bg-white px-3 py-2 text-black placeholder:text-neutral-400 focus:border-black focus:outline-none disabled:bg-neutral-100 disabled:text-neutral-500"
      />

      {showList && (
        <ul
          id={listboxId}
          role="listbox"
          className="absolute z-10 mt-1 max-h-60 w-full overflow-auto border border-neutral-300 bg-white"
        >
          {isSearching && visibleSuggestions.length === 0 ? (
            <li className="px-3 py-2 text-sm text-neutral-500">
              {t("suggest.searching")}
            </li>
          ) : visibleSuggestions.length === 0 ? (
            <li className="px-3 py-2 text-sm text-neutral-500">
              {t("suggest.noResults")}
            </li>
          ) : (
            visibleSuggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.mbid ?? suggestion.name}-${index}`}
                role="option"
                aria-selected={index === activeIndex}
              >
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(suggestion)}
                  className={`block w-full px-3 py-2 text-left text-sm text-black hover:bg-neutral-100 ${
                    index === activeIndex ? "bg-neutral-100" : ""
                  }`}
                >
                  {suggestion.name}
                </button>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
