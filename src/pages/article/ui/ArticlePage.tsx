import { useRef, useMemo } from "react";
import Head from "next/head";
import NextLink from "next/link";

import {
  ARTICLES,
  ArticleCard,
  ArticleCover,
  type Article,
  PopularList,
  popularArticles,
} from "@/entities/article";
import { CAT_LABEL, CategoryTag } from "@/entities/category";
import { ShareRow, ShareButtons } from "@/features/share-article";
import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";
import { ArticleBody } from "@/widgets/article-content";
import {
  ArticleToc,
  ArticleTocMobile,
  ReadingProgress,
  type TocSection,
} from "@/widgets/article-toc";
import { FinalCta } from "@/widgets/final-cta";
import { Button, Icon } from "@/shared/ui";
import { siteConfig } from "@/shared/config";

/** Extract h2 headings from HTML content string to build TOC. */
function extractTocSections(html: string): TocSection[] {
  if (!html) return [];
  const withId = Array.from(html.matchAll(/<h2[^>]*id="([^"]+)"[^>]*>(.*?)<\/h2>/gi));
  if (withId.length > 0) {
    return withId.map((m) => ({ id: m[1], title: m[2].replace(/<[^>]+>/g, "") }));
  }
  // Fallback: extract h2 text without id, use index as id
  const noId = Array.from(html.matchAll(/<h2[^>]*>(.*?)<\/h2>/gi));
  return noId.map((m, i) => ({ id: `s${i + 1}`, title: m[1].replace(/<[^>]+>/g, "") }));
}

interface ArticlePageProps {
  article: Article;
}

/** /blog/[slug] — article reader with TOC, share, lead funnel and CTA. */
export function ArticlePage({ article }: ArticlePageProps) {
  const articleRef = useRef<HTMLElement>(null);

  const related = article.relatedArticles || ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);
  const popular = popularArticles(4, article.slug);

  // Build TOC from actual article content; fall back to empty array
  const tocSections = useMemo(
    () => extractTocSections(article.content || ""),
    [article.content]
  );

  // Author data from API or fallback
  const authorName = (article as any).author?.name || "Команда Bilimtrack";
  const authorAvatar = (article as any).author?.avatarUrl || "/logo-mark.png";

  return (
    <>
      <Head>
        <title>{`${article.title} — Блог Bilimtrack`}</title>
        <meta content={article.excerpt} name="description" />
        <meta content={article.title} property="og:title" />
        <meta content={article.excerpt} property="og:description" />
        <meta content="article" property="og:type" />
      </Head>

      <ReadingProgress targetRef={articleRef} />
      <SiteHeader activeHref="/blog" />

      <main className="page container">
        <div className="article-shell">
          <article ref={articleRef} className="article-main">
            <nav className="crumbs">
              <NextLink href="/blog">Блог</NextLink>
              <Icon name="chevron-right" />
              <NextLink href={`/blog?cat=${article.cat}`}>
                {CAT_LABEL[article.cat]}
              </NextLink>
              <Icon name="chevron-right" />
              <span>{article.title}</span>
            </nav>

            <header className="article-head">
              <div className="article-head__meta">
                <CategoryTag category={article.cat} />
              </div>
              <h1>{article.title}</h1>
              {article.excerpt && (
                <p className="article-standfirst">{article.excerpt}</p>
              )}
              <div className="article-byline">
                <img alt={authorName} src={authorAvatar} />
                <div className="article-byline__id">
                  <div className="article-byline__name">
                    <b>{authorName}</b>
                    <span className="verified" title="Проверено редакцией">
                      <Icon name="check" />
                    </span>
                  </div>
                  <div className="byline-meta">
                    <span>
                      <Icon name="calendar" />
                      {article.date}
                    </span>
                    <span className="dot" />
                    <span>
                      <Icon name="clock" />
                      {article.read} мин чтения
                    </span>
                  </div>
                </div>
              </div>
              <ShareRow />
            </header>

            <div className="article-cover">
              <ArticleCover cat={article.cat} cover={article.cover} />
            </div>

            <ArticleTocMobile sections={tocSections} />

            <ArticleBody slug={article.slug} content={article.content} />

            <FinalCta />

            <section className="related">
              <div className="section-label">
                <h2>Читать также</h2>
              </div>
              <div className="card-grid">
                {related.map((a) => (
                  <ArticleCard key={a.slug} article={a} />
                ))}
              </div>
            </section>
          </article>

          <aside className="article-aside">
            <ArticleToc sections={tocSections} />

            <div className="cta-card">
              <img alt="" className="cta-card__mascot" src="/mascot-panda.png" />
              <h3>Получить демо Bilimtrack</h3>
              <p>Покажем систему на примере вашей организации.</p>
              <Button href={siteConfig.demoHref}>
                Получить демо
                <Icon name="chevron-right" />
              </Button>
            </div>

            <div className="side-block">
              <h4 className="side-block__title">Поделиться</h4>
              <ShareButtons />
            </div>

            <div className="side-block">
              <h4 className="side-block__title">Популярные статьи</h4>
              <PopularList articles={popular} />
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </>
  );
}
