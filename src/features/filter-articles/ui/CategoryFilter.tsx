import { CATEGORIES, type CategoryKey } from "@/entities/category";
import { cn } from "@/shared/lib";

interface CategoryFilterProps {
  activeCat: CategoryKey;
  counts: Record<CategoryKey, number>;
  onSelect: (key: CategoryKey) => void;
}

/** Horizontal pill row that filters the feed without reloading. */
export function CategoryFilter({
  activeCat,
  counts,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="filter-row">
      {CATEGORIES.map((c) => (
        <button
          key={c.key}
          className={cn("chip", c.key === activeCat && "is-active")}
          type="button"
          onClick={() => onSelect(c.key)}
        >
          {c.label}
          <span className="chip__count">{counts[c.key]}</span>
        </button>
      ))}
    </div>
  );
}
