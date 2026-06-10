import { Icon } from "@/shared/ui";

import type { TocSection } from "./ArticleToc";

interface ArticleTocMobileProps {
  sections: TocSection[];
}

/** Collapsible table of contents shown under the article header on mobile. */
export function ArticleTocMobile({ sections }: ArticleTocMobileProps) {
  return (
    <details className="toc-mobile">
      <summary>
        Содержание
        <Icon name="chevron-down" />
      </summary>
      <ol>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a href={`#${s.id}`}>
              {i + 1}. {s.title}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
