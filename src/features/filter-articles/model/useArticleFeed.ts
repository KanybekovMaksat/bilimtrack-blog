import { useCallback, useMemo, useState, useEffect } from "react";

import { ARTICLES, type Article } from "@/entities/article";
import {
  CATEGORIES,
  CAT_LABEL,
  type CategoryKey,
} from "@/entities/category";

const PAGE_SIZE = 6;

export interface ArticleFeed {
  activeCat: CategoryKey;
  /** Value shown in the search box (may differ from the filter term). */
  inputValue: string;
  isSearching: boolean;
  counts: Record<CategoryKey, number>;

  /** Featured hero post (only on the default "all" view). */
  hero: Article | null;
  /** Cards currently visible (sliced to the paging window). */
  visible: Article[];
  /** Total matches excluding the hero. */
  restCount: number;
  heading: string;
  isEmpty: boolean;
  emptyText: string;
  hasMore: boolean;

  selectCategory: (key: CategoryKey) => void;
  search: (value: string) => void;
  applyTopic: (label: string, term: string) => void;
  loadMore: () => void;
}

/**
 * Orchestrates the blog feed: category filter + free-text search + hero
 * featured post + "load more" paging. Pure client state, no reloads.
 */
export function useArticleFeed(
  initialCategory: CategoryKey = "all",
  initialArticles?: any[]
): ArticleFeed {
  const [activeCat, setActiveCat] = useState<CategoryKey>(initialCategory);
  const [inputValue, setInputValue] = useState("");
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);

  const [fetchedArticles, setFetchedArticles] = useState<any[] | null>(initialArticles || null);

  useEffect(() => {
    if (!initialArticles) {
      import("@/shared/api/blog-api").then(({ blogApi }) => {
        blogApi.getArticles({ limit: 50 })
          .then(res => {
            if (res.data) {
              const mapped = res.data.map((item: any) => ({
                slug: item.slug,
                cat: item.category?.slug || "cases",
                cover: item.coverImageUrl || "journal",
                title: item.title,
                date: new Date(item.publishedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
                iso: item.publishedAt,
                read: item.readingTime || 5,
                excerpt: item.excerpt,
              }));
              setFetchedArticles(mapped);
            }
          })
          .catch(err => console.error("Failed to fetch articles client-side", err));
      });
    }
  }, [initialArticles]);

  const feedArticles = useMemo(() => fetchedArticles ? fetchedArticles : ARTICLES, [fetchedArticles]);

  const counts = useMemo(() => {
    const out = {} as Record<CategoryKey, number>;

    CATEGORIES.forEach((c) => {
      out[c.key] =
        c.key === "all"
          ? feedArticles.length
          : feedArticles.filter((a) => a.cat === c.key).length;
    });

    return out;
  }, []);

  const filtered = useMemo(() => {
    let list =
      activeCat === "all"
        ? feedArticles
        : feedArticles.filter((a) => a.cat === activeCat);

    if (query) {
      const q = query.toLowerCase();

      list = list.filter((a) =>
        (a.title + " " + a.excerpt).toLowerCase().includes(q),
      );
    }

    return list;
  }, [activeCat, query]);

  const isSearching = query.length > 0;
  const showHero = activeCat === "all" && !isSearching;

  const hero = useMemo(() => {
    if (!showHero) return null;

    return feedArticles.find((a) => a.featured) ?? filtered[0] ?? null;
  }, [showHero, filtered, feedArticles]);

  const rest = useMemo(
    () => (hero ? filtered.filter((a) => a !== hero) : filtered),
    [filtered, hero],
  );

  const visible = rest.slice(0, shown);

  const heading = showHero
    ? "Свежие статьи"
    : isSearching
      ? `Результаты: «${query}»`
      : CAT_LABEL[activeCat];

  const selectCategory = useCallback((key: CategoryKey) => {
    setActiveCat(key);
    setQuery("");
    setInputValue("");
    setShown(PAGE_SIZE);
  }, []);

  const search = useCallback((value: string) => {
    setInputValue(value);
    setQuery(value.trim());
    setShown(PAGE_SIZE);
  }, []);

  const applyTopic = useCallback((label: string, term: string) => {
    setActiveCat("all");
    setInputValue(label);
    setQuery(term);
    setShown(PAGE_SIZE);
  }, []);

  const loadMore = useCallback(() => setShown((s) => s + PAGE_SIZE), []);

  return {
    activeCat,
    inputValue,
    isSearching,
    counts,
    hero,
    visible,
    restCount: rest.length,
    heading,
    isEmpty: rest.length === 0,
    emptyText: isSearching
      ? "По запросу ничего не найдено. Попробуйте другой запрос."
      : "В этой категории пока нет статей.",
    hasMore: rest.length > shown,
    selectCategory,
    search,
    applyTopic,
    loadMore,
  };
}
