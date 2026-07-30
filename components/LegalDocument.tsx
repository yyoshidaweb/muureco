import type { LegalDocument } from "@/lib/legal/content";

export function LegalDocument({ document }: { document: LegalDocument }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-bold text-black">{document.title}</h1>
      <p className="mt-2 text-sm text-neutral-500">{document.updatedAt}</p>

      <div className="mt-8 space-y-8">
        {document.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold text-black">
              {section.heading}
            </h2>
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
