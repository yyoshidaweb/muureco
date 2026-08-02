import type { ContentDocument } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n";

/** Apple が定める商標クレジット。どの言語でもこの英文のまま載せる。 */
const APPLE_TRADEMARK_CREDIT =
  "Apple and Apple Music are trademarks of Apple Inc., registered in the U.S. and other countries.";

export const creditsContent: Record<Locale, ContentDocument> = {
  ja: {
    title: "クレジット",
    preamble: [
      "ミューレコは、外部サービスのデータおよび試聴音源を利用して提供されています。各サービスとの関係とクレジット表記は以下のとおりです。",
    ],
    sections: [
      {
        heading: "データ提供元",
        blocks: [
          {
            type: "paragraph",
            text: "アーティスト情報・タグ・類似アーティストなどのデータは、音楽サービス Last.fm から取得しています。",
          },
          {
            type: "link",
            label: "Last.fm",
            href: "https://www.last.fm/ja/",
          },
          {
            type: "paragraph",
            text: "本サービスは Last.fm の公式サービスではなく、Last.fm とは資本関係、運営関係、提携関係その他一切の関係がありません（非公式・非提携）。",
          },
        ],
      },
      {
        heading: "試聴音源",
        blocks: [
          {
            type: "paragraph",
            text: "おすすめアーティストの試聴音源は、iTunes提供です。",
          },
          {
            type: "paragraph",
            text: "Provided courtesy of iTunes",
          },
          {
            type: "paragraph",
            text: "本サービスは Apple / Apple Music / iTunes の公式サービスではなく、これらとは資本関係、運営関係、提携関係その他一切の関係がありません（非公式・非提携）。",
          },
          {
            type: "paragraph",
            text: APPLE_TRADEMARK_CREDIT,
          },
        ],
      },
    ],
    closing: [],
  },
  en: {
    title: "Credits",
    preamble: [
      "Muureco is provided using data and audio previews from external services. Credits and relationships with each service are as follows.",
    ],
    sections: [
      {
        heading: "Data provider",
        blocks: [
          {
            type: "paragraph",
            text: "Artist information, tags, similar artists, and related data are obtained from the music service Last.fm.",
          },
          {
            type: "link",
            label: "Last.fm",
            href: "https://www.last.fm/",
          },
          {
            type: "paragraph",
            text: "This service is not an official Last.fm service and has no capital, operational, partnership, or other relationship with Last.fm (unofficial / unaffiliated).",
          },
        ],
      },
      {
        heading: "Audio previews",
        blocks: [
          {
            type: "paragraph",
            text: "Audio previews for recommended artists are provided courtesy of iTunes.",
          },
          {
            type: "paragraph",
            text: "This service is not an official Apple / Apple Music / iTunes service and has no capital, operational, partnership, or other relationship with them (unofficial / unaffiliated).",
          },
          {
            type: "paragraph",
            text: APPLE_TRADEMARK_CREDIT,
          },
        ],
      },
    ],
    closing: [],
  },
};
