import type { ContentDocument } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n";

export const algorithmContent: Record<Locale, ContentDocument> = {
  ja: {
    title: "おすすめアルゴリズムについて",
    preamble: [
      "ミューレコは、あなたが入力した好きなアーティストをもとに音楽性を診断し、おすすめのアーティストとジャンルを表示します。このページでは、その結果がどのように決まるのかを説明します。",
    ],
    sections: [
      {
        heading: "おすすめが決まるまでの流れ",
        blocks: [
          {
            type: "list",
            items: [
              "入力されたアーティスト名から、実在するアーティストを1組ずつ特定します。",
              "それぞれのアーティストに付けられた「タグ」を持ち寄って、おすすめジャンルを決めます。",
              "それぞれのアーティストと似ているとされるアーティストを集めます。",
              "あなたの好みにより多く重なるアーティストほど上位になるよう並べ替えて、おすすめアーティストとして表示します。",
            ],
          },
          {
            type: "paragraph",
            text: "以降で、それぞれのステップをもう少し詳しく説明します。",
          },
        ],
      },
      {
        heading: "ステップ1：アーティストを特定する",
        blocks: [
          {
            type: "paragraph",
            text: "入力欄に文字を入れると候補が表示され、そこから選ぶことでアーティストが確定します。入力された名前は音楽サービス Last.fm のアーティスト検索にかけられ、最も一致するアーティストが1組選ばれます。大文字・小文字の違いや前後の空白は、同じアーティストとして扱います。",
          },
          {
            type: "paragraph",
            text: "好きなアーティストは10組まで指定できます。指定が多いほど、複数のアーティストに共通する傾向が結果に表れやすくなります。該当するアーティストが見つからなかった場合は、その旨をエラーとしてお知らせします。",
          },
        ],
      },
      {
        heading: "ステップ2：おすすめジャンルを決める",
        blocks: [
          {
            type: "paragraph",
            text: "Last.fm では、リスナーがアーティストに「タグ」と呼ばれる言葉を自由に付けています。たとえば「rock」「j-pop」「shoegaze」「chillout」のように、ジャンルや曲の雰囲気を表す言葉です。タグには、そのアーティストにどれだけ多く付けられたかを表す0〜100の数値が付いています。",
          },
          {
            type: "paragraph",
            text: "ミューレコは、入力されたすべてのアーティストのタグを持ち寄り、同じタグの数値を足し合わせます。たとえば2組のアーティストに「rock」がそれぞれ100と60付いていれば、合計は160になります。こうして合計が大きかった順に、上位10件をおすすめジャンルとして表示します。",
          },
          {
            type: "paragraph",
            text: "そのため、あなたが選んだアーティストに共通して付けられているタグほど、上位に表示されやすくなります。",
          },
        ],
      },
      {
        heading: "ステップ3：おすすめアーティストを選ぶ",
        blocks: [
          {
            type: "paragraph",
            text: "Last.fm は、リスナーの聴き方の傾向をもとに、アーティストごとに「似ているアーティスト」の一覧を持っています。それぞれには、どのくらい似ているかを0〜1の数値で表した一致度が付いています。ミューレコは、入力されたアーティスト1組につき、似ているアーティストを最大10組まで集めます。",
          },
          {
            type: "paragraph",
            text: "同じアーティストが複数の入力アーティストから挙がった場合は、一致度を合計したうえで、そのアーティストを挙げた入力アーティストの組数を掛けます。これにより、あなたの好みの複数に重なるアーティストが上位に来やすくなります。",
          },
          {
            type: "paragraph",
            text: "たとえば2組のアーティストを入力し、あるアーティストが一致度0.8と0.6で両方から挙がった場合、合計1.4に「2組から挙がった」ことを表す2を掛けて2.8点になります。一方、1組からだけ一致度0.7で挙がったアーティストは0.7点です。この場合、前者が上位に表示されます。",
          },
          {
            type: "paragraph",
            text: "なお、あなたが入力したアーティスト自身はおすすめから除きます。最後に点数の高い順に並べ、上位10組をおすすめアーティストとして表示します。",
          },
        ],
      },
      {
        heading: "使っているデータについて",
        blocks: [
          {
            type: "paragraph",
            text: "タグと「似ているアーティスト」の情報は、音楽サービス Last.fm が公開しているものを、診断のたびに取得しています。ミューレコが音源そのものを解析しているわけではありません。また、あなたの再生履歴やアカウント情報を利用することもありません。",
          },
          {
            type: "link",
            label: "Last.fm",
            href: "https://www.last.fm/ja/",
          },
          {
            type: "paragraph",
            text: "本サービスは Last.fm の公式サービスではなく、Last.fm とは資本関係、運営関係、提携関係その他一切の関係がありません。",
          },
        ],
      },
      {
        heading: "仕組み上の注意点",
        blocks: [
          {
            type: "paragraph",
            text: "おすすめは、あくまでリスナーの傾向をもとにした機械的な集計結果です。次のような特徴があることをご了承ください。",
          },
          {
            type: "list",
            items: [
              "多くの人に聴かれているアーティストほど情報が豊富なため、上位に表示されやすい傾向があります。",
              "新しいアーティストや情報の少ないアーティストは、タグや似ているアーティストが十分に登録されておらず、結果に反映されにくいことがあります。",
              "タグはリスナーが自由に付けたものであり、必ずしも正確なジャンル分類とは限りません。",
              "元になる情報は随時更新されるため、同じアーティストを入力しても結果が変わることがあります。",
            ],
          },
        ],
      },
    ],
    closing: [],
  },
  en: {
    title: "How recommendations work",
    preamble: [
      "Muureco reads the artists you enter, works out the musical character they share, and shows you recommended artists and genres. This page explains how those results are decided.",
    ],
    sections: [
      {
        heading: "How a recommendation is made",
        blocks: [
          {
            type: "list",
            items: [
              "Each name you enter is matched to a real artist.",
              "The tags attached to those artists are gathered together to decide the recommended genres.",
              "Artists considered similar to each of your artists are collected.",
              "Those artists are ranked so that the ones overlapping with more of your favorites come first, and shown as recommended artists.",
            ],
          },
          {
            type: "paragraph",
            text: "Each step is described in more detail below.",
          },
        ],
      },
      {
        heading: "Step 1: Identifying the artists",
        blocks: [
          {
            type: "paragraph",
            text: "As you type, suggestions appear, and picking one confirms the artist. The name is looked up in the artist search of the music service Last.fm, and the closest match is selected. Differences in capitalization and surrounding spaces are treated as the same artist.",
          },
          {
            type: "paragraph",
            text: "You can enter up to 10 favorite artists. The more you enter, the more the tendencies shared across them show up in the results. If no matching artist is found, you will see an error telling you so.",
          },
        ],
      },
      {
        heading: "Step 2: Deciding the recommended genres",
        blocks: [
          {
            type: "paragraph",
            text: "On Last.fm, listeners freely attach words called tags to artists — words describing a genre or a mood, such as “rock”, “j-pop”, “shoegaze”, or “chillout”. Each tag carries a number from 0 to 100 showing how often it has been applied to that artist.",
          },
          {
            type: "paragraph",
            text: "Muureco gathers the tags of every artist you entered and adds up the numbers for identical tags. If two artists carry “rock” with 100 and 60, for example, the total becomes 160. The 10 tags with the highest totals are shown as your recommended genres.",
          },
          {
            type: "paragraph",
            text: "As a result, tags shared across the artists you chose are the most likely to appear near the top.",
          },
        ],
      },
      {
        heading: "Step 3: Choosing the recommended artists",
        blocks: [
          {
            type: "paragraph",
            text: "Based on listening patterns, Last.fm keeps a list of similar artists for each artist, each with a match value from 0 to 1 indicating how alike they are. Muureco collects up to 10 similar artists for every artist you entered.",
          },
          {
            type: "paragraph",
            text: "When the same artist is suggested by several of your artists, the match values are added up and then multiplied by the number of your artists that suggested them. This pushes artists that overlap with more of your tastes toward the top.",
          },
          {
            type: "paragraph",
            text: "Suppose you enter two artists, and one artist is suggested by both with match values of 0.8 and 0.6. The total of 1.4 is multiplied by 2, because two of your artists suggested them, giving 2.8 points. An artist suggested by only one of them with a match value of 0.7 scores 0.7 points, so the first artist ranks higher.",
          },
          {
            type: "paragraph",
            text: "The artists you entered are excluded from the recommendations. Finally, the remaining artists are sorted by score and the top 10 are shown as your recommended artists.",
          },
        ],
      },
      {
        heading: "About the data we use",
        blocks: [
          {
            type: "paragraph",
            text: "The tags and similar artists come from information published by the music service Last.fm, fetched each time a diagnosis runs. Muureco does not analyze the audio itself, and it does not use your listening history or account information.",
          },
          {
            type: "link",
            label: "Last.fm",
            href: "https://www.last.fm/",
          },
          {
            type: "paragraph",
            text: "This service is not an official Last.fm service and has no capital, operational, partnership, or other relationship with Last.fm.",
          },
        ],
      },
      {
        heading: "Limitations to keep in mind",
        blocks: [
          {
            type: "paragraph",
            text: "Recommendations are a mechanical tally of listener tendencies, so please keep the following in mind.",
          },
          {
            type: "list",
            items: [
              "Widely listened artists have richer information, so they tend to appear higher in the results.",
              "New or lesser-known artists may have few tags or similar artists registered, so they are less likely to be reflected in the results.",
              "Tags are added freely by listeners and are not always an accurate genre classification.",
              "The underlying information is updated continuously, so the same input can produce different results over time.",
            ],
          },
        ],
      },
    ],
    closing: [],
  },
};
