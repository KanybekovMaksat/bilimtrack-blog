import { useEffect, useState } from "react";

import { cn } from "@/shared/lib";

export interface TocSection {
  id: string;
  title: string;
}

interface ArticleTocProps {
  sections: TocSection[];
}

/** Sticky desktop table of contents with scroll-spy highlighting. */
export function ArticleToc({ sections }: ArticleTocProps) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  useEffect(() => {
    const heads = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) setActive(en.target.id);
        });
      },
      { rootMargin: "-88px 0px -65% 0px", threshold: 0 },
    );

    heads.forEach((h) => spy.observe(h));

    return () => spy.disconnect();
  }, [sections]);

  return (
    <nav className="toc side-block">
      <h4 className="side-block__title">Содержание</h4>
      <ul>
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              className={cn(active === s.id && "is-active")}
              href={`#${s.id}`}
            >
              {i + 1}. {s.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
