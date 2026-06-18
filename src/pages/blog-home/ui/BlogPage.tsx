import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { ArticleGrid } from "@/entities/article";
import { CAT_LABEL, type CategoryKey } from "@/entities/category";
import { CategoryFilter, useArticleFeed } from "@/features/filter-articles";
import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";
import { BlogHero } from "@/widgets/blog-hero";
import { CategoriesSidebar } from "@/widgets/blog-sidebar";
import { Button, Icon } from "@/shared/ui";

const isCategoryKey = (v: unknown): v is CategoryKey =>
  typeof v === "string" && v in CAT_LABEL;

/** Main blog page container using FSD hierarchy. */
export function BlogPage() {
  const router = useRouter();
  const feed = useArticleFeed("all");


  // Sync ?cat=… (e.g. from sidebar category links) into the feed.
  const catParam = router.query.cat;

  useEffect(() => {
    if (isCategoryKey(catParam)) feed.selectCategory(catParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catParam]);

  return (
    <>
      <Head>
        <title>
          Блог Bilimtrack — материалы для руководителей учебных организаций
        </title>
        <meta
          content="Практические материалы для руководителей учебных организаций."
          name="description"
        />
        <meta content="Блог Bilimtrack" property="og:title" />
        <meta
          content="Практические материалы для руководителей учебных организаций."
          property="og:description"
        />
        <meta content="website" property="og:type" />
      </Head>

      <SiteHeader activeHref="/blog" />

      <main className="page container">
        <BlogHero
          articleCount={feed.totalCount}
          inputValue={feed.inputValue}
          onSearch={feed.search}
          onTopic={feed.applyTopic}
        />

        <CategoryFilter
          activeCat={feed.activeCat}
          counts={{} as any}
          onSelect={feed.selectCategory}
        />

        <div className="with-sidebar">
          <div className="feed">
            <ArticleGrid articles={feed.visible as any} />

            {feed.isEmpty && (
              <div className="empty-state">{feed.emptyText}</div>
            )}

            {feed.hasMore && (
              <div className="load-more-wrap">
                <Button variant="outline" onPress={feed.loadMore}>
                  Загрузить ещё
                  <Icon name="chevron-down" />
                </Button>
              </div>
            )}
          </div>

          <CategoriesSidebar
            currentCat={feed.activeCat}
            counts={{} as any}
            onSelect={feed.selectCategory}
          />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
