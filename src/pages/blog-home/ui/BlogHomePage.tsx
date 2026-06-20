import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import { ArticleCard, HeroPost } from "@/entities/article";
import { CAT_LABEL, type CategoryKey } from "@/entities/category";
import { CategoryFilter, useArticleFeed, type MappedArticle } from "@/features/filter-articles";
import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";
import { BlogHero } from "@/widgets/blog-hero";
import { BlogSidebar } from "@/widgets/blog-sidebar";
import { Button, Icon } from "@/shared/ui";
import { pluralArticles } from "@/shared/lib";

const isCategoryKey = (v: unknown): v is CategoryKey =>
  typeof v === "string" && v in CAT_LABEL;

interface BlogHomePageProps {
  initialHero: MappedArticle | null;
  initialArticles: MappedArticle[];
  initialTotalCount: number;
  initialNextUrl: string | null;
}

/** /blog — knowledge-hub home: hero, live filter + search, feed, sidebar. */
export function BlogHomePage({
  initialHero,
  initialArticles,
  initialTotalCount,
  initialNextUrl,
}: BlogHomePageProps) {
  const router = useRouter();
  const feed = useArticleFeed("all", {
    initialHero,
    initialArticles,
    initialTotalCount,
    initialNextUrl,
  });

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
            {feed.hero && (
              <div>
                <HeroPost article={feed.hero as any} />
              </div>
            )}

            <div className="section-label">
              <h2>{feed.heading}</h2>
              <span className="count">
                {feed.restCount
                  ? `${feed.restCount} ${pluralArticles(feed.restCount)}`
                  : ""}
              </span>
            </div>

            <div className="card-grid">
              {feed.visible.map((article) => (
                <ArticleCard key={article.slug} article={article as any} />
              ))}
            </div>

            {feed.isLoading && (
              <div className="empty-state">Загрузка…</div>
            )}

            {feed.isEmpty && !feed.isLoading && (
              <div className="empty-state">{feed.emptyText}</div>
            )}

            {feed.hasMore && !feed.isLoading && (
              <div className="load-more-wrap">
                <Button variant="outline" onPress={feed.loadMore}>
                  Загрузить ещё
                  <Icon name="chevron-down" />
                </Button>
              </div>
            )}
          </div>

          <BlogSidebar currentCat={feed.activeCat} counts={{} as any} popular={feed.visible.slice(0, 4) as any} />
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
