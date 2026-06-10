import type { GetStaticPaths, GetStaticProps } from "next";

import { ArticlePage } from "@/pages/article";
import { ARTICLES, findArticle, type Article } from "@/entities/article";

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: ARTICLES.map((a) => ({ params: { slug: a.slug } })),
  fallback: "blocking",
});

export const getStaticProps: GetStaticProps<
  { article: Article },
  { slug: string }
> = async ({ params }) => {
  const article = params && findArticle(params.slug);

  if (!article) return { notFound: true };

  return { props: { article } };
};

export default function ArticleRoute({ article }: { article: Article }) {
  return <ArticlePage article={article} />;
}
