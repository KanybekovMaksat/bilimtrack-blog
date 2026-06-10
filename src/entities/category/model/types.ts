/** Real article categories (excludes the synthetic "all" filter). */
export type ArticleCategory = "manage" | "cases" | "advice" | "news";

/** Filter keys = real categories + the "all" pseudo-category. */
export type CategoryKey = "all" | ArticleCategory;

export interface Category {
  key: CategoryKey;
  label: string;
}
