import type { Locale } from "@/lib/i18n";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  title: string;
  updatedAt: string;
  sections: LegalSection[];
};

export const termsContent: Record<Locale, LegalDocument> = {
  ja: {
    title: "利用規約",
    updatedAt: "最終更新日：2026年7月30日",
    sections: [
      {
        heading: "第1条（適用）",
        paragraphs: [
          "この利用規約（以下「本規約」といいます。）は、Yuma Yoshida（以下「運営者」といいます。）が提供するミューレコ（以下「本サービス」といいます。）の利用条件を定めるものです。",
          "ユーザーは、本規約に同意のうえ本サービスを利用するものとします。",
        ],
      },
      {
        heading: "第2条（サービス内容）",
        paragraphs: [
          "本サービスは、ユーザーが入力したアーティスト名をもとに音楽性の診断およびおすすめアーティストの表示を行います。",
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
          "ユーザーは、本サービスの利用にあたり、法令または公序良俗に違反する行為、本サービスの運営を妨害する行為、不正アクセスその他これらに準ずる行為を行ってはなりません。",
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
          "運営者は、必要に応じて本規約を変更できます。変更後の規約は、本ページへの掲載時点で効力を生じます。",
        ],
      },
    ],
  },
  en: {
    title: "Terms of Service",
    updatedAt: "Last updated: July 30, 2026",
    sections: [
      {
        heading: "Article 1 (Scope)",
        paragraphs: [
          "These Terms of Service (\"Terms\") set forth the conditions for using Muureco (the \"Service\") provided by Yuma Yoshida (the \"Operator\").",
          "By using the Service, you agree to these Terms.",
        ],
      },
      {
        heading: "Article 2 (Service Description)",
        paragraphs: [
          "The Service diagnoses your musical taste based on artist names you enter and displays recommended artists.",
          "The Service is not an official Last.fm product and has no capital, operational, partnership, or any other relationship with Last.fm.",
        ],
      },
      {
        heading: "Article 3 (Handling of Input Data)",
        paragraphs: [
          "Artist names entered by users and diagnosis outputs are used only for transient processing required to provide the Service.",
          "The Operator does not retain such input data in databases or any other persistent storage.",
        ],
      },
      {
        heading: "Article 4 (Prohibited Conduct)",
        paragraphs: [
          "You must not use the Service in ways that violate laws or public order, interfere with operation of the Service, attempt unauthorized access, or engage in similar misconduct.",
        ],
      },
      {
        heading: "Article 5 (Disclaimer)",
        paragraphs: [
          "The Operator does not guarantee uninterrupted availability, accuracy, or completeness of the Service.",
          "Except in cases of willful misconduct or gross negligence by the Operator, the Operator is not liable for damages arising from use or inability to use the Service.",
        ],
      },
      {
        heading: "Article 6 (Changes to Terms)",
        paragraphs: [
          "The Operator may revise these Terms when necessary. Revised Terms become effective when posted on this page.",
        ],
      },
    ],
  },
};

export const privacyContent: Record<Locale, LegalDocument> = {
  ja: {
    title: "プライバシーポリシー",
    updatedAt: "最終更新日：2026年7月30日",
    sections: [
      {
        heading: "第1条（基本方針）",
        paragraphs: [
          "ミューレコ（以下「本サービス」といいます。）は、ユーザーのプライバシーを尊重し、取得した情報を適切に取り扱います。",
        ],
      },
      {
        heading: "第2条（取得する情報）",
        paragraphs: [
          "本サービスは、診断のためにユーザーが入力したアーティスト名を受け取ります。",
          "本サービスはユーザー登録機能を提供しておらず、氏名・住所・電話番号・メールアドレスなどの個人情報を取得しません。",
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
          "本サービスは診断処理のために公開APIを利用しますが、Last.fmが本サービスの運営主体となることはありません。",
        ],
      },
      {
        heading: "第6条（ポリシーの変更）",
        paragraphs: [
          "運営者は、必要に応じて本ポリシーを変更できます。変更後の内容は本ページ掲載時点から有効です。",
        ],
      },
    ],
  },
  en: {
    title: "Privacy Policy",
    updatedAt: "Last updated: July 30, 2026",
    sections: [
      {
        heading: "Article 1 (Basic Policy)",
        paragraphs: [
          "Muureco (the \"Service\") respects user privacy and handles received information appropriately.",
        ],
      },
      {
        heading: "Article 2 (Information We Receive)",
        paragraphs: [
          "For diagnosis, the Service receives artist names entered by users.",
          "The Service has no user account system and does not collect personal information such as name, address, phone number, or email address.",
        ],
      },
      {
        heading: "Article 3 (Purpose of Use)",
        paragraphs: [
          "Input data is used only to run diagnosis processing and display recommended artists.",
          "Input data is not used for analytics, advertising, or sales purposes.",
        ],
      },
      {
        heading: "Article 4 (Retention Policy)",
        paragraphs: [
          "The Service does not persistently store submitted artist names or diagnosis outputs.",
          "Input data is not retained after processing and is not accumulated in databases or other persistent storage.",
        ],
      },
      {
        heading: "Article 5 (Relationship with Last.fm)",
        paragraphs: [
          "The Service is not an official Last.fm product and has no affiliation or operational relationship with Last.fm.",
          "The Service may use publicly available APIs for diagnosis, but Last.fm is not the operator of this Service.",
        ],
      },
      {
        heading: "Article 6 (Policy Changes)",
        paragraphs: [
          "The Operator may update this policy when necessary. Updates become effective when posted on this page.",
        ],
      },
    ],
  },
};
