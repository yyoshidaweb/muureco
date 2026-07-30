import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

const content: Record<
  Locale,
  {
    title: string;
    updatedAt: string;
    sections: Array<{ heading: string; paragraphs: string[] }>;
  }
> = {
  ja: {
    title: "プライバシーポリシー",
    updatedAt: "最終更新日：2026年7月30日",
    sections: [
      {
        heading: "第1条（基本方針）",
        paragraphs: [
          "ミューレコ（以下「本サービス」といいます。）は、ユーザーのプライバシーを尊重し、個人情報を適切に取り扱います。",
        ],
      },
      {
        heading: "第2条（取得する情報）",
        paragraphs: [
          "本サービスは、診断のためにユーザーが入力したアーティスト名を受け取ります。",
          "本サービスは、ユーザー登録機能を提供しておらず、氏名・住所・電話番号などの個人情報を取得しません。",
        ],
      },
      {
        heading: "第3条（利用目的）",
        paragraphs: [
          "入力情報は、診断処理およびおすすめアーティスト表示のためにのみ利用します。",
          "入力情報は分析・広告・営業目的では利用しません。",
        ],
      },
      {
        heading: "第4条（保存期間と保持方針）",
        paragraphs: [
          "本サービスは、入力されたアーティスト名および診断結果を永続的に保存しません。",
          "入力データは処理完了後に保持せず、データベース等への蓄積を行いません。",
        ],
      },
      {
        heading: "第5条（Last.fmとの関係）",
        paragraphs: [
          "本サービスはLast.fmの公式サービスではなく、Last.fmとは一切の提携・運営関係がありません。",
          "本サービスは、診断処理のために公開APIを利用しますが、Last.fmが本サービスの運営主体となることはありません。",
        ],
      },
      {
        heading: "第6条（ポリシーの変更）",
        paragraphs: [
          "運営者は、必要に応じて本ポリシーを変更できます。",
          "変更後の内容は本ページ掲載時点から有効です。",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updatedAt: "Last updated: Jul 30, 2026",
    sections: [
      {
        heading: "1. Basic Policy",
        paragraphs: [
          "Muureco (the \"Service\") respects your privacy and handles information appropriately.",
        ],
      },
      {
        heading: "2. Information We Receive",
        paragraphs: [
          "For diagnosis, the Service receives artist names entered by users.",
          "The Service has no user account system and does not collect personal information such as name, address, or phone number.",
        ],
      },
      {
        heading: "3. Purpose of Use",
        paragraphs: [
          "Input data is used only to run diagnosis processing and display recommendations.",
          "Input data is not used for analytics, advertising, or sales purposes.",
        ],
      },
      {
        heading: "4. Retention Policy",
        paragraphs: [
          "The Service does not persistently store submitted artist names or diagnosis outputs.",
          "Input data is not retained after processing and is not accumulated in databases or other persistent storage.",
        ],
      },
      {
        heading: "5. Relationship with Last.fm",
        paragraphs: [
          "The Service is not an official Last.fm product and has no affiliation or operational relationship with Last.fm.",
          "The Service may use publicly available APIs for diagnosis, but Last.fm is not the operator of this Service.",
        ],
      },
      {
        heading: "6. Policy Changes",
        paragraphs: [
          "We may update this policy when necessary.",
          "Any updates become effective when posted on this page.",
        ],
      },
    ],
  },
};

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) {
    notFound();
  }
  const locale: Locale = localeParam;
  const doc = content[locale];

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-bold text-black">{doc.title}</h1>
      <p className="mt-2 text-sm text-neutral-500">{doc.updatedAt}</p>

      <div className="mt-8 space-y-8">
        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold text-black">{section.heading}</h2>
            <div className="mt-3 space-y-2 text-sm leading-7 text-neutral-700 sm:text-base">
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
