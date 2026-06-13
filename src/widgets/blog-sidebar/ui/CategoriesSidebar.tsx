import NextLink from "next/link";
import { CATEGORIES, type CategoryKey } from "@/entities/category";

interface CategoriesSidebarProps {
  /** The currently active category key for styling the active state. */
  currentCat?: CategoryKey;
  /** Article count dictionary mapped by category key. */
  counts?: Record<CategoryKey, number>;
  /** Callback for when a category link is clicked to update filter state. */
  onSelect?: (key: CategoryKey) => void;
}

/** Sidebar widget focusing exclusively on category filtering with counts. */
export function CategoriesSidebar({
  currentCat,
  counts = {} as Record<CategoryKey, number>,
  onSelect,
}: CategoriesSidebarProps) {
  const categories = CATEGORIES.filter((c) => c.key !== "all");

  return (
    <aside className="sidebar">
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
                onClick={(e) => {
                  if (onSelect) {
                    e.preventDefault();
                    onSelect(c.key);
                  }
                }}
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
