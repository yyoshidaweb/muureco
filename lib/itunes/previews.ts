import { lookupTracks, searchArtists } from "./client";
import type { ArtistPreview, ItunesArtist, ItunesTrack } from "./types";

/** ひらがな・カタカナ・漢字（半角カナを含む）。 */
const JAPANESE_PATTERN =
  /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uff66-\uff9f]/;

function normalizeName(name: string): string {
  return name.trim().toLowerCase();
}

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

/**
 * アーティスト名ごとの試聴音源を集める。上限はIP単位で効くため、共有IPになる
 * サーバーではなく利用者のブラウザから呼ぶ。失敗しても例外は投げず、取れた分
 * だけを返す。
 */
export async function fetchPreviews(
  names: string[],
): Promise<Map<string, ArtistPreview>> {
  const previews = new Map<string, ArtistPreview>();

  if (names.length === 0) {
    return previews;
  }

  const failures: string[] = [];

  const artists = await Promise.all(
    names.map(async (name) => {
      try {
        return matchArtist(await searchArtists(name), name);
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

  names.forEach((name, index) => {
    const artist = artists[index];
    const track = artist && tracks.get(artist.id);

    if (track) {
      previews.set(name, {
        url: track.previewUrl,
        trackName: track.name,
        storeUrl: track.viewUrl,
      });
    }
  });

  if (failures.length > 0) {
    // 試聴が付かないだけで診断は成立するため、利用者には見せずログにだけ残す。
    console.error("Failed to fetch iTunes previews", {
      failed: failures.length,
      reasons: [...new Set(failures)],
    });
  }

  return previews;
}
