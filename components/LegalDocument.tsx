import type { LegalDocument as LegalDocumentModel } from "@/lib/legal/content";

export function LegalDocument({ document }: { document: LegalDocumentModel }) {
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-3xl font-bold text-black">{document.title}</h1>

      <div className="mt-6 space-y-3 text-sm leading-7 text-neutral-700 sm:text-base">
        {document.preamble.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-10 space-y-8">
        {document.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold text-black">
              {section.heading}
            </h2>
            <div className="mt-3 space-y-3 text-sm leading-7 text-neutral-700 sm:text-base">
              {section.blocks.map((block, blockIndex) => {
                if (block.type === "paragraph") {
                  return (
                    <p key={`${section.heading}-p-${blockIndex}`}>
                      {block.text}
                    </p>
                  );
                }

                if (block.type === "link") {
                  return (
                    <p key={`${section.heading}-a-${blockIndex}`}>
                      <a
                        href={block.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-black"
                      >
                        {block.label}
                      </a>
                    </p>
                  );
                }

                return (
                  <ol
                    key={`${section.heading}-l-${blockIndex}`}
                    className="list-decimal space-y-2 pl-5"
                  >
                    {block.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-10 space-y-1 text-sm leading-7 text-neutral-700 sm:text-base">
        {document.closing.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>
    </main>
  );
}
