import NextLink from "next/link";

import { PopularList, type Article } from "@/entities/article";
import { CATEGORIES, type CategoryKey } from "@/entities/category";
import { Button, Icon } from "@/shared/ui";
import { siteConfig } from "@/shared/config";

interface BlogSidebarProps {
  /** Highlights the active category in the categories block. */
  currentCat?: CategoryKey;
  popular?: Article[];
  counts?: Record<CategoryKey, number>;
}

/** Blog feed sidebar: demo CTA, popular articles, categories. */
export function BlogSidebar({ currentCat, popular = [], counts = {} as Record<CategoryKey, number> }: BlogSidebarProps) {
  const categories = CATEGORIES.filter((c) => c.key !== "all");

  return (
    <aside className="sidebar">
      <div className="side-block">
        <div className="cta-card">
          <img alt="" className="cta-card__mascot" src="/mascot-panda.png" />
          <h3>Хотите посмотреть, как это работает?</h3>
          <p>Покажем Bilimtrack на примере вашей организации.</p>
          <Button href={siteConfig.demoHref}>
            Получить демо
            <Icon name="chevron-right" />
          </Button>
        </div>
      </div>

      <div className="side-block">
        <h4 className="side-block__title">Популярные статьи</h4>
        <PopularList articles={popular} />
      </div>

      <div className="side-block">
        <h4 className="side-block__title">Категории</h4>
        <nav className="cat-list">
          {categories.map((c) => {
            const count = counts[c.key] || 0;

            return (
              <NextLink
                key={c.key}
                href={`/blog?cat=${c.key}`}
                style={
                  c.key === currentCat
                    ? { background: "var(--surface-middle)" }
                    : undefined
                }
              >
                {c.label}
                <span className="n">{count}</span>
              </NextLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
