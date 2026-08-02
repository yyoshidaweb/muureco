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
  onSelect: (artist: ArtistSuggestion, options?: { addNext?: boolean }) => void;
  onRequestAddNext?: () => void;
  excludedNames: string[];
  disabled?: boolean;
  autoFocus?: boolean;
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
  onRequestAddNext,
  excludedNames,
  disabled = false,
  autoFocus = false,
  "aria-label": ariaLabel,
}: ArtistSuggestFieldProps) {
  const { t } = useLocale();
  const listboxId = useId();
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const isComposingRef = useRef(false);
  const [searchState, setSearchState] = useState<SearchState>({ status: "idle" });
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
  const highlightedIndex =
    showList && visibleSuggestions.length > 0
      ? activeIndex >= 0
        ? Math.min(activeIndex, visibleSuggestions.length - 1)
        : 0
      : -1;

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
        setActiveIndex(0);
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

  useEffect(() => {
    if (highlightedIndex < 0 || !listRef.current) return;
    const list = listRef.current;
    const option = list.querySelector<HTMLElement>(
      `[data-suggestion-index="${highlightedIndex}"]`,
    );
    if (!option) return;

    const listRect = list.getBoundingClientRect();
    const optionRect = option.getBoundingClientRect();

    if (optionRect.bottom > listRect.bottom) {
      list.scrollTop += optionRect.bottom - listRect.bottom;
    } else if (optionRect.top < listRect.top) {
      list.scrollTop -= listRect.top - optionRect.top;
    }
  }, [highlightedIndex]);

  function selectSuggestion(
    artist: ArtistSuggestion,
    options?: { addNext?: boolean },
  ) {
    onSelect(artist, options);
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
    // 日本語IMEの変換確定Enterを候補選択・フォーム追加と区別する。
    // 一部ブラウザでは compositionend 後に isComposing=false の Enter が来るため、
    // composition 中フラグも合わせて見る。
    const isComposing =
      isComposingRef.current ||
      event.nativeEvent.isComposing ||
      event.keyCode === 229;

    if (event.key === "Enter" && selected !== null) {
      if (isComposing) return;
      event.preventDefault();
      onRequestAddNext?.();
      return;
    }

    if (!showList || visibleSuggestions.length === 0) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      if (isComposing) return;
      event.preventDefault();
      setActiveIndex((prev) =>
        prev < visibleSuggestions.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      if (isComposing) return;
      event.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : visibleSuggestions.length - 1,
      );
      return;
    }

    if (event.key === "Enter") {
      if (isComposing) return;
      event.preventDefault();
      if (highlightedIndex >= 0) {
        selectSuggestion(visibleSuggestions[highlightedIndex], {
          addNext: true,
        });
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
        onCompositionStart={() => {
          isComposingRef.current = true;
        }}
        onCompositionEnd={() => {
          // compositionend の直後に届く変換確定Enterを無視するため、解除を遅らせる
          window.setTimeout(() => {
            isComposingRef.current = false;
          }, 0);
        }}
        onFocus={() => {
          if (selected === null && trimmedQuery) {
            setIsOpen(true);
          }
        }}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoFocus={autoFocus}
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
          ref={listRef}
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
                data-suggestion-index={index}
                role="option"
                aria-selected={index === highlightedIndex}
              >
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(suggestion)}
                  className={`block w-full px-3 py-2 text-left text-sm text-black hover:bg-neutral-100 ${
                    index === highlightedIndex ? "bg-neutral-100" : ""
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
