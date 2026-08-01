import {
  getArtistTopTags,
  getSimilarArtists,
  searchArtist,
} from "@/lib/lastfm";
import type { LastfmArtist } from "@/lib/lastfm";
import { lookupTracks, searchArtists } from "@/lib/itunes";
import type { ItunesArtist, ItunesTrack } from "@/lib/itunes";
import { ArtistNotFoundError } from "./errors";
import type { DiagnoseResult, DiagnosisTag, Recommendation } from "./types";

const DIAGNOSIS_LIMIT = 10;
const RECOMMENDATION_LIMIT = 10;
const SIMILAR_ARTISTS_LIMIT = 10;

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

async function resolveArtist(name: string): Promise<LastfmArtist> {
  const results = await searchArtist(name, { limit: 1 });
  const top = results[0];
  if (!top) {
    throw new ArtistNotFoundError(name);
  }
  return top;
}

function buildDiagnosis(
  tagLists: { name: string; count: number }[][],
): DiagnosisTag[] {
  const scores = new Map<string, number>();

  for (const tags of tagLists) {
    for (const tag of tags) {
      scores.set(tag.name, (scores.get(tag.name) ?? 0) + tag.count);
    }
  }

  return [...scores.entries()]
    .map(([name, score]) => ({ name, score }))
    .sort((a, b) => b.score - a.score)
    .slice(0, DIAGNOSIS_LIMIT);
}

function buildRecommendations(
  similarLists: {
    name: string;
    match: number;
    mbid?: string;
  }[][],
  excludedNames: Set<string>,
): Recommendation[] {
  const entries = new Map<
    string,
    {
      name: string;
      score: number;
      mbid?: string;
      seedCount: number;
    }
  >();

  for (const similar of similarLists) {
    for (const artist of similar) {
      if (excludedNames.has(normalizeName(artist.name))) {
        continue;
      }

      const key = normalizeName(artist.name);
      const existing = entries.get(key);
      if (existing) {
        existing.score += artist.match;
        existing.seedCount += 1;
      } else {
        entries.set(key, {
          name: artist.name,
          score: artist.match,
          mbid: artist.mbid,
          seedCount: 1,
        });
      }
    }
  }

  return [...entries.values()]
    .map(({ name, score, mbid, seedCount }) => ({
      name,
      score: score * seedCount,
      mbid,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, RECOMMENDATION_LIMIT);
}

/** ひらがな・カタカナ・漢字（半角カナを含む）。 */
const JAPANESE_PATTERN =
  /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uff66-\uff9f]/;

function matchArtist(
  candidates: ItunesArtist[],
  name: string,
): ItunesArtist | undefined {
  // Last.fm が日本語表記、Apple がローマ字表記を返すことが多く、日本語名では
  // 文字列が一致しない。表記体系が揃うラテン文字名のときだけ、別アーティストの
  // 曲を拾わないよう名前の一致を求める。
  if (JAPANESE_PATTERN.test(name)) {
    return candidates[0];
  }

  return candidates.find(
    (candidate) => normalizeName(candidate.name) === normalizeName(name),
  );
}

async function withPreviews(
  recommendations: Recommendation[],
): Promise<Recommendation[]> {
  const failures: string[] = [];

  const artists = await Promise.all(
    recommendations.map(async (recommendation) => {
      try {
        return matchArtist(
          await searchArtists(recommendation.name),
          recommendation.name,
        );
      } catch (error) {
        failures.push(error instanceof Error ? error.message : String(error));
        return undefined;
      }
    }),
  );

  let tracks = new Map<number, ItunesTrack>();
  try {
    tracks = await lookupTracks([
      ...new Set(artists.flatMap((artist) => (artist ? [artist.id] : []))),
    ]);
  } catch (error) {
    failures.push(error instanceof Error ? error.message : String(error));
  }

  if (failures.length > 0) {
    // 試聴が付かないだけで診断は成立するため、利用者には見せずログにだけ残す。
    console.error("Failed to fetch iTunes previews", {
      failed: failures.length,
      reasons: [...new Set(failures)],
    });
  }

  return recommendations.map((recommendation, index) => {
    const artist = artists[index];
    const track = artist && tracks.get(artist.id);

    if (!track) {
      return recommendation;
    }

    return {
      ...recommendation,
      preview: {
        url: track.previewUrl,
        trackName: track.name,
        storeUrl: track.viewUrl,
      },
    };
  });
}

export async function diagnose(artistNames: string[]): Promise<DiagnoseResult> {
  const resolved = await Promise.all(artistNames.map(resolveArtist));

  const excludedNames = new Set([
    ...artistNames.map(normalizeName),
    ...resolved.map((a) => normalizeName(a.name)),
  ]);

  const artistData = await Promise.all(
    resolved.map(async (artist) => {
      const [tags, similar] = await Promise.all([
        getArtistTopTags(artist.name, { mbid: artist.mbid || undefined }),
        getSimilarArtists(artist.name, {
          limit: SIMILAR_ARTISTS_LIMIT,
          mbid: artist.mbid || undefined,
        }),
      ]);
      return { tags, similar };
    }),
  );

  const recommendations = buildRecommendations(
    artistData.map((d) => d.similar),
    excludedNames,
  );

  return {
    diagnosis: buildDiagnosis(artistData.map((d) => d.tags)),
    recommendations: await withPreviews(recommendations),
  };
}
