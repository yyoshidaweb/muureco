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
    title: "利用規約",
    updatedAt: "最終更新日：2026年7月30日",
    sections: [
      {
        heading: "第1条（適用）",
        paragraphs: [
          "本規約は、ミューレコ（以下「本サービス」といいます。）の利用条件を定めるものです。",
          "ユーザーは、本規約に同意のうえ本サービスを利用するものとします。",
        ],
      },
      {
        heading: "第2条（サービス内容）",
        paragraphs: [
          "本サービスは、入力されたアーティスト名をもとに音楽性の診断およびおすすめアーティストの表示を行います。",
          "本サービスはLast.fmの公式サービスではなく、Last.fmとは資本関係・運営関係・提携関係を含めて一切関係がありません。",
        ],
      },
      {
        heading: "第3条（入力データの取り扱い）",
        paragraphs: [
          "ユーザーが入力したアーティスト名および診断結果は、診断処理のためにのみ一時的に使用します。",
          "運営者は、前項の入力データをデータベースその他の永続的な保存先に保持しません。",
        ],
      },
      {
        heading: "第4条（禁止事項）",
        paragraphs: [
          "法令または公序良俗に違反する行為、または本サービスの運営を妨害する行為を禁止します。",
          "不正アクセス、リバースエンジニアリング、その他これらに準ずる行為を禁止します。",
        ],
      },
      {
        heading: "第5条（免責事項）",
        paragraphs: [
          "運営者は、本サービスの継続性・正確性・完全性を保証しません。",
          "運営者は、本サービスの利用または利用不能により生じた損害について、運営者の故意または重過失がある場合を除き責任を負いません。",
        ],
      },
      {
        heading: "第6条（規約の変更）",
        paragraphs: [
          "運営者は、必要に応じて本規約を変更できます。",
          "変更後の規約は、本ページへの掲載時点で効力を生じます。",
        ],
      },
    ],
  },
  en: {
    title: "Terms of Service",
    updatedAt: "Last updated: Jul 30, 2026",
    sections: [
      {
        heading: "1. Scope",
        paragraphs: [
          "These Terms govern the use of Muureco (the \"Service\").",
          "By using the Service, you agree to these Terms.",
        ],
      },
      {
        heading: "2. Service Description",
        paragraphs: [
          "The Service analyzes your music taste from artist names you enter and shows recommended artists.",
          "The Service is not an official Last.fm product and has no capital, operational, or partnership relationship with Last.fm.",
        ],
      },
      {
        heading: "3. Input Data Handling",
        paragraphs: [
          "Artist names entered by users and diagnosis outputs are used only for transient processing.",
          "We do not retain such input data in databases or any other persistent storage.",
        ],
      },
      {
        heading: "4. Prohibited Conduct",
        paragraphs: [
          "You must not violate laws, public order, or interfere with the operation of the Service.",
          "Unauthorized access, reverse engineering, and similar conduct are prohibited.",
        ],
      },
      {
        heading: "5. Disclaimer",
        paragraphs: [
          "The operator does not guarantee uninterrupted service, accuracy, or completeness.",
          "The operator is not liable for damages arising from use of the Service, except in cases of willful misconduct or gross negligence.",
        ],
      },
      {
        heading: "6. Changes to Terms",
        paragraphs: [
          "We may update these Terms when necessary.",
          "Updated Terms become effective when posted on this page.",
        ],
      },
    ],
  },
};

export default async function TermsPage({
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
