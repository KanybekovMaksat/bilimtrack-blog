import { cn } from "@/shared/lib";

import type { ArticleCategory } from "../model/types";
import { CAT_LABEL } from "../model/data";

interface CategoryTagProps {
  category: ArticleCategory;
  className?: string;
}

/** Pastel category pill (`.tag.tag--{cat}` from the design system). */
export function CategoryTag({ category, className }: CategoryTagProps) {
  return (
    <span className={cn("tag", `tag--${category}`, className)}>
      {CAT_LABEL[category]}
    </span>
  );
}
