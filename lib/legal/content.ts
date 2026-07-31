import type { ContentDocument } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n";

const CONTACT_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSc8eKryKffl-fMdxtvVjxsXrXvU1WnwbDtRVMA5tw3hghR9AQ/viewform?usp=header";

const SPOTIFY_PRIVACY_URL = "https://www.spotify.com/legal/privacy-policy/";

export const termsContent: Record<Locale, ContentDocument> = {
  ja: {
    title: "利用規約",
    preamble: [
      "この利用規約（以下、「本規約」といいます。）は、Yuma Yoshida（以下、「運営者」といいます。）がこのウェブサイト上で提供するサービス（以下、「本サービス」といいます。）の利用条件を定めるものです。本サービスをご利用になる皆さま（以下、「ユーザー」といいます。）には、本規約に従って、本サービスをご利用いただきます。",
    ],
    sections: [
      {
        heading: "第1条（適用）",
        blocks: [
          {
            type: "list",
            items: [
              "本規約は、ユーザーと運営者との間の本サービスの利用に関わる一切の関係に適用されるものとします。",
              "運営者は本サービスに関し、本規約のほか、ご利用にあたってのルール等、各種の定め（以下、「個別規定」といいます。）をすることがあります。これら個別規定はその名称のいかんに関わらず、本規約の一部を構成するものとします。",
              "本規約の規定が個別規定の規定と矛盾する場合には、個別規定において特段の定めなき限り、個別規定の規定が優先されるものとします。",
            ],
          },
        ],
      },
      {
        heading: "第2条（サービス内容）",
        blocks: [
          {
            type: "list",
            items: [
              "本サービスは、ユーザーが入力したアーティスト名をもとに、音楽性の診断およびおすすめアーティストの表示を行うウェブサービスです。",
              "本サービスは、現時点において利用登録を要せず、誰でも利用できるものとします。",
              "本サービスはLast.fmの公式サービスではなく、Last.fmとは資本関係、運営関係、提携関係その他一切の関係がありません。本サービスにおけるLast.fmへの言及またはデータ利用は、公開されているAPI等を通じたものであり、Last.fmによる保証、後援、または共同運営を意味するものではありません。",
            ],
          },
        ],
      },
      {
        heading: "第3条（利用料金および支払方法）",
        blocks: [
          {
            type: "list",
            items: [
              "本サービスは、現時点において無償で提供されます。",
              "運営者は、将来、本サービスの全部または一部を有料とする場合があります。その場合、運営者は事前に本ウェブサイト上で告知するものとします。",
            ],
          },
        ],
      },
      {
        heading: "第4条（入力データの取り扱い）",
        blocks: [
          {
            type: "list",
            items: [
              "ユーザーが本サービスに入力したアーティスト名その他の情報および診断結果は、本サービスの提供（診断処理およびおすすめアーティスト表示）のためにのみ、一時的に使用します。",
              "運営者は、前項の入力データおよび診断結果を、データベースその他の永続的な保存先に保持しません。処理完了後、運営者はこれらを保持しません。",
            ],
          },
        ],
      },
      {
        heading: "第5条（禁止事項）",
        blocks: [
          {
            type: "paragraph",
            text: "ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。",
          },
          {
            type: "list",
            items: [
              "法令または公序良俗に違反する行為",
              "犯罪行為に関連する行為",
              "運営者、本サービスの他のユーザー、または第三者のサーバーまたはネットワークの機能を破壊したり、妨害したりする行為",
              "運営者のサービスの運営を妨害するおそれのある行為",
              "他のユーザーに関する個人情報等を収集または蓄積する行為",
              "不正アクセスをし、またはこれを試みる行為",
              "他のユーザーに成りすます行為",
              "運営者のサービスに関連して、反社会的勢力に対して直接または間接に利益を供与する行為",
              "運営者、本サービスの他のユーザーまたは第三者の知的財産権、肖像権、プライバシー、名誉その他の権利または利益を侵害する行為",
              "過度に暴力的な表現、露骨な性的表現、差別につながる表現、自殺・自傷行為・薬物乱用を誘引または助長する表現、その他反社会的な内容を含み他人に不快感を与える表現を本サービス上に送信する行為",
              "営業、宣伝、広告、勧誘その他営利を目的とする行為（運営者の認めたものを除きます。）、嫌がらせや誹謗中傷を目的とする行為、運営者・他のユーザーまたは第三者に不利益・損害・不快感を与えることを目的とする行為、その他本サービスが予定している利用目的と異なる目的で本サービスを利用する行為",
              "宗教活動または宗教団体への勧誘行為",
              "その他、運営者が不適切と判断する行為",
            ],
          },
        ],
      },
      {
        heading: "第6条（本サービスの提供の停止等）",
        blocks: [
          {
            type: "paragraph",
            text: "運営者は、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を停止または中断することができるものとします。",
          },
          {
            type: "list",
            items: [
              "本サービスにかかるコンピュータシステムの保守点検または更新を行う場合",
              "地震、落雷、火災、停電または天災などの不可抗力により、本サービスの提供が困難となった場合",
              "コンピュータまたは通信回線等が事故により停止した場合",
              "その他、運営者が本サービスの提供が困難と判断した場合",
            ],
          },
          {
            type: "paragraph",
            text: "運営者は、本サービスの提供の停止または中断により、ユーザーまたは第三者が被ったいかなる不利益または損害についても、一切の責任を負わないものとします。",
          },
        ],
      },
      {
        heading: "第7条（著作権）",
        blocks: [
          {
            type: "list",
            items: [
              "本サービスおよび本サービスに関連する一切の情報についての著作権およびその他の知的財産権はすべて運営者または運営者にその利用を許諾した権利者に帰属し、ユーザーは無断で複製、譲渡、貸与、翻訳、改変、転載、公衆送信（送信可能化を含みます。）、伝送、配布、出版、営業使用等をしてはならないものとします。",
              "本サービスが表示するアーティスト名、タグ、関連情報等には、第三者に帰属する情報が含まれる場合があります。これらの権利は各権利者に帰属します。",
            ],
          },
        ],
      },
      {
        heading: "第8条（利用制限）",
        blocks: [
          {
            type: "paragraph",
            text: "運営者は、ユーザーが以下のいずれかに該当する場合には、事前の通知なく、ユーザーに対して本サービスの全部もしくは一部の利用を制限することができるものとします。",
          },
          {
            type: "list",
            items: [
              "本規約のいずれかの条項に違反した場合",
              "運営者からの連絡に対し、一定期間返答がない場合",
              "その他、運営者が本サービスの利用を適当でないと判断した場合",
            ],
          },
          {
            type: "paragraph",
            text: "運営者は、本条に基づき運営者が行った行為によりユーザーに生じた損害について、一切の責任を負いません。",
          },
        ],
      },
      {
        heading: "第9条（保証の否認および免責事項）",
        blocks: [
          {
            type: "list",
            items: [
              "運営者は、本サービスに事実上または法律上の瑕疵（安全性、信頼性、正確性、完全性、有効性、特定の目的への適合性、セキュリティなどに関する欠陥、エラーやバグ、権利侵害などを含みます。）がないことを明示的にも黙示的にも保証しておりません。",
              "運営者は、本サービスに起因してユーザーに生じたあらゆる損害について、運営者の故意又は重過失による場合を除き、一切の責任を負いません。ただし、本サービスに関する運営者とユーザーとの間の契約（本規約を含みます。）が消費者契約法に定める消費者契約となる場合、この免責規定は適用されません。",
              "前項ただし書に定める場合であっても、運営者は、運営者の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害のうち特別な事情から生じた損害（運営者またはユーザーが損害発生につき予見し、または予見し得た場合を含みます。）について一切の責任を負いません。また、運営者の過失（重過失を除きます。）による債務不履行または不法行為によりユーザーに生じた損害の賠償は、ユーザーから当該損害が発生した月に受領した利用料の額を上限とします。",
              "運営者は、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じた取引、連絡または紛争等について一切責任を負いません。",
            ],
          },
        ],
      },
      {
        heading: "第10条（サービス内容の変更等）",
        blocks: [
          {
            type: "paragraph",
            text: "運営者は、ユーザーへの事前の告知をもって、本サービスの内容を変更、追加または廃止することがあり、ユーザーはこれを承諾するものとします。",
          },
        ],
      },
      {
        heading: "第11条（利用規約の変更）",
        blocks: [
          {
            type: "paragraph",
            text: "運営者は以下の場合には、ユーザーの個別の同意を要せず、本規約を変更することができるものとします。",
          },
          {
            type: "list",
            items: [
              "本規約の変更がユーザーの一般の利益に適合するとき。",
              "本規約の変更が本サービス利用契約の目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他の変更に係る事情に照らして合理的なものであるとき。",
            ],
          },
          {
            type: "paragraph",
            text: "運営者はユーザーに対し、前項による本規約の変更にあたり、事前に、本規約を変更する旨及び変更後の本規約の内容並びにその効力発生時期を通知します。",
          },
        ],
      },
      {
        heading: "第12条（個人情報の取扱い）",
        blocks: [
          {
            type: "paragraph",
            text: "運営者は、本サービスの利用によって取得する個人情報については、運営者「プライバシーポリシー」に従い適切に取り扱うものとします。",
          },
        ],
      },
      {
        heading: "第13条（通知または連絡）",
        blocks: [
          {
            type: "paragraph",
            text: "ユーザーと運営者との間の通知または連絡は、運営者の定める方法によって行うものとします。本サービスに関するお問い合わせは、本ウェブサイト上に掲載する連絡先またはお問い合わせ手段により受け付けるものとします。",
          },
        ],
      },
      {
        heading: "第14条（権利義務の譲渡の禁止）",
        blocks: [
          {
            type: "paragraph",
            text: "ユーザーは、運営者の書面による事前の承諾なく、利用契約上の地位または本規約に基づく権利もしくは義務を第三者に譲渡し、または担保に供することはできません。",
          },
        ],
      },
      {
        heading: "第15条（準拠法・裁判管轄）",
        blocks: [
          {
            type: "list",
            items: [
              "本規約の解釈にあたっては、日本法を準拠法とします。",
              "本サービスに関して紛争が生じた場合には、運営者の住所地を管轄する裁判所を専属的合意管轄とします。",
            ],
          },
        ],
      },
    ],
    closing: ["制定日：2026年7月30日", "以上"],
  },
  en: {
    title: "Terms of Service",
    preamble: [
      'These Terms of Service ("Terms") set forth the terms and conditions for use of the service (the "Service") provided on this website by Yuma Yoshida (the "Operator"). All users of the Service ("Users") shall use the Service in accordance with these Terms.',
    ],
    sections: [
      {
        heading: "Article 1 (Applicability)",
        blocks: [
          {
            type: "list",
            items: [
              "These Terms apply to all relationships between Users and the Operator regarding use of the Service.",
              'In addition to these Terms, the Operator may establish rules and other provisions regarding use of the Service ("Individual Provisions"). Regardless of their name, Individual Provisions constitute part of these Terms.',
              "If any provision of these Terms conflicts with an Individual Provision, the Individual Provision shall prevail unless otherwise expressly provided therein.",
            ],
          },
        ],
      },
      {
        heading: "Article 2 (Description of the Service)",
        blocks: [
          {
            type: "list",
            items: [
              "The Service is a web service that diagnoses musical taste based on artist names entered by Users and displays recommended artists.",
              "At present, the Service does not require user registration and may be used by anyone.",
              "The Service is not an official Last.fm service and has no capital, operational, partnership, or any other relationship with Last.fm. Any reference to Last.fm or use of Last.fm data in the Service is made through publicly available APIs or similar means and does not imply endorsement, sponsorship, or joint operation by Last.fm.",
            ],
          },
        ],
      },
      {
        heading: "Article 3 (Fees and Payment)",
        blocks: [
          {
            type: "list",
            items: [
              "The Service is currently provided free of charge.",
              "The Operator may make all or part of the Service fee-based in the future. In that case, the Operator will provide prior notice on this website.",
            ],
          },
        ],
      },
      {
        heading: "Article 4 (Handling of Input Data)",
        blocks: [
          {
            type: "list",
            items: [
              "Artist names and other information entered by Users, as well as diagnosis results, are used only temporarily to provide the Service (diagnosis processing and display of recommended artists).",
              "The Operator does not retain such input data or diagnosis results in databases or any other persistent storage. After processing is completed, the Operator does not keep them.",
            ],
          },
        ],
      },
      {
        heading: "Article 5 (Prohibited Acts)",
        blocks: [
          {
            type: "paragraph",
            text: "Users shall not engage in any of the following acts in connection with use of the Service:",
          },
          {
            type: "list",
            items: [
              "Acts that violate laws or public order and morals",
              "Acts related to criminal conduct",
              "Acts that destroy or interfere with the servers or network functions of the Operator, other Users, or third parties",
              "Acts that may interfere with the operation of the Operator's services",
              "Collecting or accumulating personal information about other Users",
              "Unauthorized access, or attempts thereof",
              "Impersonating other Users",
              "Directly or indirectly providing benefits to antisocial forces in connection with the Operator's services",
              "Infringing the intellectual property rights, portrait rights, privacy, honor, or other rights or interests of the Operator, other Users, or third parties",
              "Transmitting through the Service content that is excessively violent, sexually explicit, or discriminatory; content that induces or promotes suicide, self-harm, or drug abuse; or other antisocial content that causes discomfort to others",
              "Acts for business, promotional, advertising, solicitation, or other commercial purposes (except those approved by the Operator); acts for the purpose of harassment or defamation; acts intended to cause disadvantage, damage, or discomfort to the Operator, other Users, or third parties; or other use of the Service for purposes different from those intended for the Service",
              "Religious activities or solicitation for religious organizations",
              "Any other acts the Operator deems inappropriate",
            ],
          },
        ],
      },
      {
        heading: "Article 6 (Suspension of the Service)",
        blocks: [
          {
            type: "paragraph",
            text: "If the Operator determines that any of the following applies, the Operator may suspend or interrupt all or part of the Service without prior notice to Users:",
          },
          {
            type: "list",
            items: [
              "When performing maintenance, inspection, or updates of the computer systems related to the Service",
              "When provision of the Service becomes difficult due to force majeure such as earthquake, lightning, fire, power outage, or natural disaster",
              "When computers or communication lines stop due to an accident",
              "When the Operator otherwise determines that provision of the Service is difficult",
            ],
          },
          {
            type: "paragraph",
            text: "The Operator shall bear no liability for any disadvantage or damage incurred by Users or third parties as a result of suspension or interruption of the Service.",
          },
        ],
      },
      {
        heading: "Article 7 (Copyright)",
        blocks: [
          {
            type: "list",
            items: [
              "All copyrights and other intellectual property rights in the Service and all information related to the Service belong to the Operator or to rights holders who have licensed use to the Operator. Users shall not reproduce, transfer, lend, translate, modify, reprint, publicly transmit (including making transmittable), transmit, distribute, publish, or commercially use such materials without authorization.",
              "Artist names, tags, and related information displayed by the Service may include information belonging to third parties. Such rights belong to the respective rights holders.",
            ],
          },
        ],
      },
      {
        heading: "Article 8 (Restriction of Use)",
        blocks: [
          {
            type: "paragraph",
            text: "If any of the following applies to a User, the Operator may, without prior notice, restrict all or part of the User's use of the Service:",
          },
          {
            type: "list",
            items: [
              "If the User violates any provision of these Terms",
              "If the User fails to respond to communications from the Operator for a certain period",
              "If the Operator otherwise determines that use of the Service is inappropriate",
            ],
          },
          {
            type: "paragraph",
            text: "The Operator shall bear no liability for any damage incurred by Users as a result of actions taken by the Operator under this Article.",
          },
        ],
      },
      {
        heading:
          "Article 9 (Disclaimer of Warranties and Limitation of Liability)",
        blocks: [
          {
            type: "list",
            items: [
              "The Operator makes no express or implied warranty that the Service is free from defects in fact or in law (including defects related to safety, reliability, accuracy, completeness, effectiveness, fitness for a particular purpose, or security, as well as errors, bugs, and infringement of rights).",
              "Except in cases of willful misconduct or gross negligence by the Operator, the Operator shall bear no liability for any damage incurred by Users arising from the Service. However, if the contract between the Operator and the User regarding the Service (including these Terms) constitutes a consumer contract under Japan's Consumer Contract Act, this disclaimer shall not apply.",
              "Even in the case of the preceding proviso, the Operator shall bear no liability for damages arising from special circumstances among damages incurred by Users due to non-performance or tort based on the Operator's negligence (excluding gross negligence) (including cases where the Operator or the User foresaw or could have foreseen the occurrence of the damage). In addition, compensation for damages incurred by Users due to non-performance or tort based on the Operator's negligence (excluding gross negligence) shall be limited to the amount of fees received from the User in the month in which such damage occurred.",
              "The Operator shall bear no liability for any transactions, communications, or disputes between Users and other Users or third parties in connection with the Service.",
            ],
          },
        ],
      },
      {
        heading: "Article 10 (Changes to the Service)",
        blocks: [
          {
            type: "paragraph",
            text: "The Operator may change, add to, or discontinue the Service with prior notice to Users, and Users agree to such changes.",
          },
        ],
      },
      {
        heading: "Article 11 (Changes to the Terms)",
        blocks: [
          {
            type: "paragraph",
            text: "The Operator may change these Terms without individual consent of Users in the following cases:",
          },
          {
            type: "list",
            items: [
              "When the change is consistent with the general interests of Users.",
              "When the change does not contradict the purpose of the Service use agreement and is reasonable in light of the necessity of the change, the appropriateness of the changed content, and other circumstances related to the change.",
            ],
          },
          {
            type: "paragraph",
            text: "When changing these Terms pursuant to the preceding paragraph, the Operator will notify Users in advance of the fact of the change, the content of the changed Terms, and the effective date.",
          },
        ],
      },
      {
        heading: "Article 12 (Handling of Personal Information)",
        blocks: [
          {
            type: "paragraph",
            text: 'The Operator shall appropriately handle personal information obtained through use of the Service in accordance with the Operator\'s "Privacy Policy."',
          },
        ],
      },
      {
        heading: "Article 13 (Notices and Communications)",
        blocks: [
          {
            type: "paragraph",
            text: "Notices or communications between Users and the Operator shall be made by methods designated by the Operator. Inquiries regarding the Service shall be accepted through the contact information or inquiry methods posted on this website.",
          },
        ],
      },
      {
        heading:
          "Article 14 (Prohibition of Assignment of Rights and Obligations)",
        blocks: [
          {
            type: "paragraph",
            text: "Users may not assign to a third party, or provide as security, their status under the use agreement or any rights or obligations under these Terms without the Operator's prior written consent.",
          },
        ],
      },
      {
        heading: "Article 15 (Governing Law and Jurisdiction)",
        blocks: [
          {
            type: "list",
            items: [
              "These Terms shall be governed by and construed in accordance with the laws of Japan.",
              "Any dispute arising in connection with the Service shall be subject to the exclusive jurisdiction of the court having jurisdiction over the Operator's place of residence.",
            ],
          },
        ],
      },
    ],
    closing: ["Effective date: July 30, 2026", "End of Terms"],
  },
};

export const privacyContent: Record<Locale, ContentDocument> = {
  ja: {
    title: "プライバシーポリシー",
    preamble: [
      "Yuma Yoshida（以下、「運営者」といいます。）は、本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。",
    ],
    sections: [
      {
        heading: "第1条（個人情報）",
        blocks: [
          {
            type: "paragraph",
            text: "「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。",
          },
        ],
      },
      {
        heading: "第2条（個人情報の収集方法）",
        blocks: [
          {
            type: "list",
            items: [
              "本サービスは、現時点において利用登録機能を提供しておらず、氏名、メールアドレスその他の個人情報の登録を求めません。",
              "本サービスは、診断処理のためにユーザーが入力したアーティスト名を受け取ります。当該情報は、個人を識別することを目的として収集するものではありません。",
              "本サービスはLast.fmの公式サービスではなく、Last.fmとは一切の関係がありません。本サービスは公開されているAPI等を通じて情報を取得することがありますが、これは本サービスの提供のためであり、Last.fmが本サービスの運営者となるものではありません。",
            ],
          },
        ],
      },
      {
        heading: "第3条（個人情報を収集・利用する目的）",
        blocks: [
          {
            type: "paragraph",
            text: "運営者が個人情報を収集・利用する目的は、以下のとおりです。",
          },
          {
            type: "list",
            items: [
              "運営者サービスの提供・運営のため",
              "ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）",
              "メンテナンス、重要なお知らせなど必要に応じたご連絡のため",
              "利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため",
              "上記の利用目的に付随する目的",
            ],
          },
          {
            type: "paragraph",
            text: "なお、ユーザーが入力したアーティスト名は、診断処理およびおすすめアーティスト表示のためにのみ一時的に使用し、分析・広告・営業目的では利用しません。",
          },
        ],
      },
      {
        heading: "第4条（入力データの保持）",
        blocks: [
          {
            type: "list",
            items: [
              "運営者は、ユーザーが入力したアーティスト名および診断結果を、データベースその他の永続的な保存先に保持しません。",
              "前項の情報は、処理完了後に保持せず、蓄積しません。",
            ],
          },
        ],
      },
      {
        heading: "第5条（外部サービスとの通信）",
        blocks: [
          {
            type: "paragraph",
            text: "本サービスは、以下の機能において、ユーザーのブラウザからSpotify AB（以下、「Spotify」といいます。）のサーバーに対して直接通信を行います。",
          },
          {
            type: "list",
            items: [
              "おすすめアーティストの画像表示。画像はSpotifyの配信サーバーから読み込まれます。",
              "おすすめアーティストの試聴。ユーザーが試聴ボタンを押した場合にのみ、Spotifyの埋め込みプレイヤーを読み込みます。",
            ],
          },
          {
            type: "paragraph",
            text: "前項の通信の際には、ユーザーのIPアドレス、ユーザーエージェント、参照元URLその他の情報がSpotifyに送信されます。また、埋め込みプレイヤーの読み込み時には、Spotifyによりクッキーその他の識別子が設定される場合があります。",
          },
          {
            type: "paragraph",
            text: "前項の情報の取扱いは、Spotifyのプライバシーポリシーに従います。運営者は、Spotifyが取得する情報の内容および利用について関与せず、これらの情報を受領しません。",
          },
          {
            type: "link",
            label: "Spotifyプライバシーポリシー",
            href: SPOTIFY_PRIVACY_URL,
          },
          {
            type: "paragraph",
            text: "本サービスはSpotifyの公式サービスではなく、Spotifyとは一切の関係がありません。",
          },
        ],
      },
      {
        heading: "第6条（利用目的の変更）",
        blocks: [
          {
            type: "list",
            items: [
              "運営者は、利用目的が変更前と関連性を有すると合理的に認められる場合に限り、個人情報の利用目的を変更するものとします。",
              "利用目的の変更を行った場合には、変更後の目的について、運営者所定の方法により、ユーザーに通知し、または本ウェブサイト上に公表するものとします。",
            ],
          },
        ],
      },
      {
        heading: "第7条（個人情報の第三者提供）",
        blocks: [
          {
            type: "paragraph",
            text: "運営者は、次に掲げる場合を除いて、あらかじめユーザーの同意を得ることなく、第三者に個人情報を提供することはありません。ただし、個人情報保護法その他の法令で認められる場合を除きます。",
          },
          {
            type: "list",
            items: [
              "人の生命、身体または財産の保護のために必要がある場合であって、本人の同意を得ることが困難であるとき",
              "公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合であって、本人の同意を得ることが困難であるとき",
              "国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合であって、本人の同意を得ることにより当該事務の遂行に支障を及ぼすおそれがあるとき",
            ],
          },
          {
            type: "paragraph",
            text: "前項の定めにかかわらず、次に掲げる場合には、当該情報の提供先は第三者に該当しないものとします。",
          },
          {
            type: "list",
            items: [
              "運営者が利用目的の達成に必要な範囲内において個人情報の取扱いの全部または一部を委託する場合",
              "合併その他の事由による事業の承継に伴って個人情報が提供される場合",
              "個人情報を特定の者との間で共同して利用する場合であって、その旨並びに共同して利用される個人情報の項目、共同して利用する者の範囲、利用する者の利用目的および当該個人情報の管理について責任を有する者の氏名または名称について、あらかじめ本人に通知し、または本人が容易に知り得る状態に置いた場合",
            ],
          },
        ],
      },
      {
        heading: "第8条（個人情報の開示）",
        blocks: [
          {
            type: "paragraph",
            text: "運営者は、本人から個人情報の開示を求められたときは、本人に対し、遅滞なくこれを開示します。ただし、開示することにより次のいずれかに該当する場合は、その全部または一部を開示しないこともあり、開示しない決定をした場合には、その旨を遅滞なく通知します。",
          },
          {
            type: "list",
            items: [
              "本人または第三者の生命、身体、財産その他の権利利益を害するおそれがある場合",
              "運営者の業務の適正な実施に著しい支障を及ぼすおそれがある場合",
              "その他法令に違反することとなる場合",
            ],
          },
          {
            type: "paragraph",
            text: "前項の定めにかかわらず、履歴情報および特性情報などの個人情報以外の情報については、原則として開示いたしません。また、運営者が入力データを保持していない場合、開示の対象となる情報がないことがあります。",
          },
        ],
      },
      {
        heading: "第9条（個人情報の訂正および削除）",
        blocks: [
          {
            type: "list",
            items: [
              "ユーザーは、運営者の保有する自己の個人情報が誤った情報である場合には、運営者が定める手続きにより、運営者に対して個人情報の訂正、追加または削除（以下、「訂正等」といいます。）を請求することができます。",
              "運営者は、ユーザーから前項の請求を受けてその請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の訂正等を行うものとします。",
              "運営者は、前項の規定に基づき訂正等を行った場合、または訂正等を行わない旨の決定をしたときは遅滞なく、これをユーザーに通知します。",
            ],
          },
        ],
      },
      {
        heading: "第10条（個人情報の利用停止等）",
        blocks: [
          {
            type: "list",
            items: [
              "運営者は、本人から、個人情報が、利用目的の範囲を超えて取り扱われているという理由、または不正の手段により取得されたものであるという理由により、その利用の停止または消去（以下、「利用停止等」といいます。）を求められた場合には、遅滞なく必要な調査を行います。",
              "前項の調査結果に基づき、その請求に応じる必要があると判断した場合には、遅滞なく、当該個人情報の利用停止等を行います。",
              "運営者は、前項の規定に基づき利用停止等を行った場合、または利用停止等を行わない旨の決定をしたときは、遅滞なく、これをユーザーに通知します。",
              "前2項にかかわらず、利用停止等に多額の費用を有する場合その他利用停止等を行うことが困難な場合であって、ユーザーの権利利益を保護するために必要なこれに代わるべき措置をとれる場合は、この代替策を講じるものとします。",
            ],
          },
        ],
      },
      {
        heading: "第11条（プライバシーポリシーの変更）",
        blocks: [
          {
            type: "list",
            items: [
              "本ポリシーの内容は、法令その他本ポリシーに別段の定めのある事項を除いて、ユーザーに通知することなく、変更することができるものとします。",
              "運営者が別途定める場合を除いて、変更後のプライバシーポリシーは、本ウェブサイトに掲載したときから効力を生じるものとします。",
            ],
          },
        ],
      },
      {
        heading: "第12条（お問い合わせ窓口）",
        blocks: [
          {
            type: "paragraph",
            text: "本ポリシーに関するお問い合わせは、下記の窓口までお願いいたします。",
          },
          {
            type: "link",
            label: "お問い合わせ",
            href: CONTACT_URL,
          },
        ],
      },
    ],
    closing: ["制定日：2026年7月30日", "以上"],
  },
  en: {
    title: "Privacy Policy",
    preamble: [
      'Yuma Yoshida (the "Operator") establishes this Privacy Policy (the "Policy") regarding the handling of Users\' personal information in connection with the service (the "Service") provided on this website.',
    ],
    sections: [
      {
        heading: "Article 1 (Personal Information)",
        blocks: [
          {
            type: "paragraph",
            text: '"Personal Information" means personal information as defined under Japan\'s Act on the Protection of Personal Information, namely information relating to a living individual that can identify a specific individual by name, date of birth, address, telephone number, contact information, or other descriptions contained in such information, as well as data relating to appearance, fingerprints, voiceprints, and information that can identify a specific individual by itself, such as the insurer number on a health insurance card (personally identifiable information).',
          },
        ],
      },
      {
        heading: "Article 2 (Methods of Collecting Personal Information)",
        blocks: [
          {
            type: "list",
            items: [
              "At present, the Service does not provide a user registration function and does not request registration of Personal Information such as name or email address.",
              "The Service receives artist names entered by Users for diagnosis processing. Such information is not collected for the purpose of identifying individuals.",
              "The Service is not an official Last.fm service and has no relationship with Last.fm. The Service may obtain information through publicly available APIs or similar means for the purpose of providing the Service, but this does not mean that Last.fm is the operator of the Service.",
            ],
          },
        ],
      },
      {
        heading:
          "Article 3 (Purposes of Collecting and Using Personal Information)",
        blocks: [
          {
            type: "paragraph",
            text: "The purposes for which the Operator collects and uses Personal Information are as follows:",
          },
          {
            type: "list",
            items: [
              "To provide and operate the Operator's services",
              "To respond to inquiries from Users (including identity verification)",
              "To provide necessary notices such as maintenance and important announcements",
              "To identify Users who violate the Terms of Service or attempt to use the Service for improper or unjust purposes, and to refuse such use",
              "Purposes incidental to the foregoing",
            ],
          },
          {
            type: "paragraph",
            text: "Artist names entered by Users are used only temporarily for diagnosis processing and display of recommended artists, and are not used for analytics, advertising, or sales purposes.",
          },
        ],
      },
      {
        heading: "Article 4 (Retention of Input Data)",
        blocks: [
          {
            type: "list",
            items: [
              "The Operator does not retain artist names entered by Users or diagnosis results in databases or any other persistent storage.",
              "Such information is not retained or accumulated after processing is completed.",
            ],
          },
        ],
      },
      {
        heading: "Article 5 (Communication with External Services)",
        blocks: [
          {
            type: "paragraph",
            text: 'For the following features, the Service communicates directly from the User\'s browser to servers operated by Spotify AB ("Spotify"):',
          },
          {
            type: "list",
            items: [
              "Display of recommended artist images. Images are loaded from Spotify's content delivery servers.",
              "Preview of recommended artists. Spotify's embedded player is loaded only when the User presses the preview button.",
            ],
          },
          {
            type: "paragraph",
            text: "During such communication, the User's IP address, user agent, referring URL, and other information are sent to Spotify. In addition, Spotify may set cookies or other identifiers when the embedded player is loaded.",
          },
          {
            type: "paragraph",
            text: "The handling of such information is governed by Spotify's privacy policy. The Operator is not involved in, and does not receive, the information that Spotify obtains or how it is used.",
          },
          {
            type: "link",
            label: "Spotify Privacy Policy",
            href: SPOTIFY_PRIVACY_URL,
          },
          {
            type: "paragraph",
            text: "The Service is not an official Spotify service and has no relationship with Spotify.",
          },
        ],
      },
      {
        heading: "Article 6 (Changes to Purposes of Use)",
        blocks: [
          {
            type: "list",
            items: [
              "The Operator shall change the purposes of use of Personal Information only when the changed purposes are reasonably related to the purposes before the change.",
              "If the Operator changes the purposes of use, the Operator shall notify Users of the changed purposes by a method designated by the Operator, or publish them on this website.",
            ],
          },
        ],
      },
      {
        heading:
          "Article 7 (Provision of Personal Information to Third Parties)",
        blocks: [
          {
            type: "paragraph",
            text: "Except in the following cases, the Operator shall not provide Personal Information to third parties without the prior consent of the User. However, this does not apply where permitted by Japan's Act on the Protection of Personal Information or other laws and regulations.",
          },
          {
            type: "list",
            items: [
              "When it is necessary to protect the life, body, or property of a person and it is difficult to obtain the consent of the individual",
              "When it is particularly necessary for improving public health or promoting the sound upbringing of children and it is difficult to obtain the consent of the individual",
              "When it is necessary to cooperate with a national agency, local government, or a person entrusted by them in performing affairs prescribed by laws and regulations, and obtaining the consent of the individual may impede the performance of such affairs",
            ],
          },
          {
            type: "paragraph",
            text: "Notwithstanding the preceding paragraph, the following recipients shall not be deemed third parties:",
          },
          {
            type: "list",
            items: [
              "When the Operator entrusts all or part of the handling of Personal Information within the scope necessary to achieve the purposes of use",
              "When Personal Information is provided in connection with business succession due to merger or other reasons",
              "When Personal Information is used jointly with specific persons, and the individual has been notified in advance, or is placed in a state where the individual can easily know, of that fact, the items of Personal Information to be used jointly, the scope of joint users, the purposes of use of the users, and the name of the person responsible for managing such Personal Information",
            ],
          },
        ],
      },
      {
        heading: "Article 8 (Disclosure of Personal Information)",
        blocks: [
          {
            type: "paragraph",
            text: "When requested by an individual to disclose Personal Information, the Operator shall disclose it to the individual without delay. However, if disclosure would fall under any of the following, the Operator may withhold all or part of the disclosure, and if the Operator decides not to disclose, the Operator shall notify the individual of that fact without delay.",
          },
          {
            type: "list",
            items: [
              "When there is a risk of harming the life, body, property, or other rights and interests of the individual or a third party",
              "When there is a risk of significantly impeding the proper conduct of the Operator's business",
              "When it would otherwise violate laws and regulations",
            ],
          },
          {
            type: "paragraph",
            text: "Notwithstanding the preceding paragraph, as a general rule, the Operator will not disclose information other than Personal Information, such as historical information and characteristic information. In addition, if the Operator does not retain input data, there may be no information subject to disclosure.",
          },
        ],
      },
      {
        heading: "Article 9 (Correction and Deletion of Personal Information)",
        blocks: [
          {
            type: "list",
            items: [
              'If a User\'s own Personal Information held by the Operator is incorrect, the User may request the Operator to correct, add to, or delete such Personal Information ("Correction, etc.") through procedures designated by the Operator.',
              "If the Operator receives a request under the preceding paragraph and determines that it is necessary to respond to the request, the Operator shall perform the Correction, etc. of such Personal Information without delay.",
              "If the Operator performs Correction, etc. pursuant to the preceding paragraph, or decides not to perform Correction, etc., the Operator shall notify the User of that fact without delay.",
            ],
          },
        ],
      },
      {
        heading: "Article 10 (Suspension of Use of Personal Information)",
        blocks: [
          {
            type: "list",
            items: [
              'If an individual requests suspension of use or erasure of Personal Information ("Suspension of Use, etc.") on the grounds that the Personal Information is being handled beyond the scope of the purposes of use, or was obtained by wrongful means, the Operator shall conduct the necessary investigation without delay.',
              "Based on the results of the investigation under the preceding paragraph, if the Operator determines that it is necessary to respond to the request, the Operator shall perform the Suspension of Use, etc. of such Personal Information without delay.",
              "If the Operator performs Suspension of Use, etc. pursuant to the preceding paragraph, or decides not to perform Suspension of Use, etc., the Operator shall notify the individual of that fact without delay.",
              "Notwithstanding the preceding two items, if Suspension of Use, etc. would involve substantial cost or is otherwise difficult, and alternative measures necessary to protect the User's rights and interests can be taken, the Operator shall take such alternative measures.",
            ],
          },
        ],
      },
      {
        heading: "Article 11 (Changes to the Privacy Policy)",
        blocks: [
          {
            type: "list",
            items: [
              "Except as otherwise provided by laws and regulations or this Policy, the content of this Policy may be changed without notice to Users.",
              "Unless otherwise specified by the Operator, the changed Privacy Policy shall take effect from the time it is posted on this website.",
            ],
          },
        ],
      },
      {
        heading: "Article 12 (Contact)",
        blocks: [
          {
            type: "paragraph",
            text: "For inquiries regarding this Policy, please contact us at the following:",
          },
          {
            type: "link",
            label: "Contact",
            href: CONTACT_URL,
          },
        ],
      },
    ],
    closing: ["Effective date: July 30, 2026", "End of Policy"],
  },
};
