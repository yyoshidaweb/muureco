"use client";

import { useRef, useState } from "react";
import {
  ArtistSuggestField,
  type ArtistSuggestion,
} from "@/components/ArtistSuggestField";
import { MAX_ARTISTS } from "@/lib/diagnose";
import { useLocale } from "@/lib/i18n";

type ArtistField = {
  query: string;
  selected: string | null;
};

type ArtistInputFormProps = {
  onArtistsChange: (artists: string[]) => void;
  error: string | null;
};

function normalizeArtistName(name: string): string {
  return name.trim().toLowerCase();
}

function findDuplicateIndex(selectedNames: (string | null)[]): number | null {
  const seen = new Map<string, number>();
  for (let i = 0; i < selectedNames.length; i++) {
    const name = selectedNames[i];
    if (!name) continue;
    const normalized = normalizeArtistName(name);
    if (seen.has(normalized)) {
      return i;
    }
    seen.set(normalized, i);
  }
  return null;
}

function artistsKey(artists: string[]): string {
  return artists.map(normalizeArtistName).join("\0");
}

function resolveReadyArtists(fields: ArtistField[]): string[] {
  const selectedNames = fields.map((f) => f.selected);
  if (findDuplicateIndex(selectedNames) !== null) {
    return [];
  }
  return selectedNames.filter((name): name is string => name !== null);
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
    </svg>
  );
}

function AddIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
    </svg>
  );
}

export function ArtistInputForm({
  onArtistsChange,
  error,
}: ArtistInputFormProps) {
  const { t } = useLocale();
  const [fields, setFields] = useState<ArtistField[]>([
    { query: "", selected: null },
  ]);
  const [autoFocusIndex, setAutoFocusIndex] = useState<number | null>(null);
  const lastEmittedKey = useRef<string>("");

  const duplicateIndex = findDuplicateIndex(fields.map((f) => f.selected));
  const allSelected = fields.every((f) => f.selected !== null);
  const atLimit = fields.length >= MAX_ARTISTS;
  const canAdd = !atLimit && allSelected;
  const showAddButton = !atLimit;

  function emitArtists(nextFields: ArtistField[]) {
    const artists = resolveReadyArtists(nextFields);
    const key = artistsKey(artists);
    if (key === lastEmittedKey.current) {
      return;
    }
    lastEmittedKey.current = key;
    onArtistsChange(artists);
  }

  function commitFields(nextFields: ArtistField[]) {
    setFields(nextFields);
    emitArtists(nextFields);
  }

  function updateQuery(index: number, query: string) {
    commitFields(
      fields.map((field, i) =>
        i === index ? { query, selected: null } : field,
      ),
    );
  }

  function selectArtist(
    index: number,
    artist: ArtistSuggestion,
    options?: { addNext?: boolean },
  ) {
    const nextFields = fields.map((field, i) =>
      i === index ? { query: artist.name, selected: artist.name } : field,
    );

    const canAddAfterSelect =
      options?.addNext === true &&
      index === fields.length - 1 &&
      nextFields.length < MAX_ARTISTS &&
      nextFields.every((field) => field.selected !== null) &&
      findDuplicateIndex(nextFields.map((field) => field.selected)) === null;

    if (canAddAfterSelect) {
      commitFields([...nextFields, { query: "", selected: null }]);
      setAutoFocusIndex(nextFields.length);
      return;
    }

    commitFields(nextFields);
  }

  function addArtist() {
    if (!canAdd) return;
    const nextIndex = fields.length;
    commitFields([...fields, { query: "", selected: null }]);
    setAutoFocusIndex(nextIndex);
  }

  function removeArtist(index: number) {
    if (fields.length <= 1) {
      commitFields([{ query: "", selected: null }]);
      return;
    }
    commitFields(fields.filter((_, i) => i !== index));
  }

  function handleFieldBlur(index: number) {
    if (index === 0) return;
    const field = fields[index];
    if (!field || field.query.trim() !== "") return;
    setAutoFocusIndex(null);
    removeArtist(index);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {fields.map((field, index) => {
          const excludedNames = fields
            .map((f, i) => (i === index ? null : f.selected))
            .filter((name): name is string => name !== null);

          return (
            <div key={index} className="flex gap-2">
              <ArtistSuggestField
                query={field.query}
                selected={field.selected}
                onQueryChange={(query) => updateQuery(index, query)}
                onSelect={(artist, options) =>
                  selectArtist(index, artist, options)
                }
                onRequestAddNext={addArtist}
                onBlur={() => handleFieldBlur(index)}
                excludedNames={excludedNames}
                autoFocus={autoFocusIndex === index}
                aria-label={t("form.artistLabel", { n: index + 1 })}
              />
              {(fields.length > 1 || field.selected !== null) && (
                <button
                  type="button"
                  onClick={() => removeArtist(index)}
                  aria-label={t("form.removeArtist", { n: index + 1 })}
                  className="flex shrink-0 cursor-pointer items-center justify-center px-2 text-black hover:text-neutral-500"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          );
        })}

        {showAddButton && (
          <div className="flex justify-center">
            <button
              type="button"
              onClick={addArtist}
              disabled={!canAdd}
              aria-label={t("form.addArtist")}
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black bg-white text-black hover:bg-neutral-100 disabled:cursor-not-allowed disabled:border-neutral-300 disabled:text-neutral-400 disabled:hover:bg-white"
            >
              <AddIcon />
            </button>
          </div>
        )}
      </div>

      {duplicateIndex !== null && (
        <p className="text-sm text-red-600" role="alert">
          {t("form.duplicateArtist")}
        </p>
      )}

      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
