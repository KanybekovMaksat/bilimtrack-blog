import { useRef, useState, useEffect } from "react";
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

const SECTIONS: TocSection[] = [
  { id: "s1", title: "С чего всё началось" },
  { id: "s2", title: "Что болело до Bilimtrack" },
  { id: "s3", title: "Как проходило внедрение" },
  { id: "s4", title: "Результаты за первый семестр" },
  { id: "s5", title: "Что дальше" },
];

interface ArticlePageProps {
  article: Article;
}

/** /blog/[slug] — article reader with TOC, share, lead funnel and CTA. */
export function ArticlePage({ article: initialArticle }: ArticlePageProps) {
  const [article, setArticle] = useState<Article>(initialArticle);
  const articleRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    if (initialArticle.slug) {
      import("@/shared/api/blog-api").then(({ blogApi }) => {
        blogApi.getArticle(initialArticle.slug)
          .then(res => {
            if (res.data) {
              setArticle({
                slug: res.data.slug,
                cat: res.data.category?.slug || initialArticle.cat,
                cover: res.data.coverImageUrl || initialArticle.cover,
                title: res.data.title,
                date: new Date(res.data.publishedAt).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }),
                iso: res.data.publishedAt,
                read: res.data.readingTime || initialArticle.read,
                excerpt: res.data.excerpt,
                content: res.data.content,
              });
            }
          })
          .catch(err => console.error("Failed to fetch article client-side", err));
      });
    }
  }, [initialArticle]);

  const related = ARTICLES.filter((a) => a.slug !== article.slug).slice(0, 3);
  const popular = popularArticles(4, article.slug);

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
                <span className="article-head__series">
                  <Icon name="book" />
                  Серия: Цифровизация школы
                </span>
              </div>
              <h1>{article.title}</h1>
              <p className="article-standfirst">
                За один семестр университет перевёл расписание, журнал и оплату в
                одну систему — без срыва учебного года. Разбираем по шагам: что
                болело, как внедряли и что получилось в цифрах.
              </p>
              <div className="article-byline">
                <img alt="" src="/logo-mark.png" />
                <div className="article-byline__id">
                  <div className="article-byline__name">
                    <b>Команда Bilimtrack</b>
                    <span className="verified" title="Проверено редакцией">
                      <Icon name="check" />
                    </span>
                    <span className="byline-role">Отдел внедрения</span>
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
                    <span className="dot" />
                    <span>Кейс с цифрами</span>
                  </div>
                </div>
              </div>
              <ShareRow />
            </header>

            <div className="article-cover">
              <ArticleCover cat={article.cat} cover={article.cover} />
            </div>

            <aside className="article-takeaways">
              <h2>
                <Icon name="sparkles" />
                Что вы узнаете из статьи
              </h2>
              <ul>
                <li>
                  <Icon name="check" />
                  Как поэтапно запустить расписание, журнал и оплату, не
                  останавливая занятия
                </li>
                <li>
                  <Icon name="check" />
                  Какие процессы отнимают больше всего времени — и как их
                  автоматизировать
                </li>
                <li>
                  <Icon name="check" />
                  Реальные результаты за первый семестр в цифрах: −70% бумаги,
                  расписание за 2–3 дня
                </li>
              </ul>
            </aside>

            <ArticleTocMobile sections={SECTIONS} />

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
            <ArticleToc sections={SECTIONS} />

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
