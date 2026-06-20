import { LeadMagnet } from "@/features/subscribe-lead";

interface ArticleBodyProps {
  /** Slug of the article being read (keys the lead-magnet state). */
  slug: string;
  /** HTML content from API. When present, renders it directly. */
  content?: string;
  /** Article ID for sourceArticle tracking. */
  articleId?: string;
}

/**
 * Renders article body.
 * - If the API returned HTML content, renders it with dangerouslySetInnerHTML
 *   followed by the LeadMagnet block.
 * - If empty/missing, renders a fallback placeholder.
 */
export function ArticleBody({ slug, content, articleId }: ArticleBodyProps) {
  if (!content || content.trim().length === 0) {
    return (
      <div className="prose" style={{ padding: "48px 0", textAlign: "center", color: "var(--text-muted, #737373)" }}>
        <p>Содержимое статьи временно недоступно или отсутствует.</p>
      </div>
    );
  }

  return (
    <div className="prose" id="prose">
      {/*
        suppressHydrationWarning: acceptable for rich HTML from a CMS editor —
        minor whitespace/attribute diffs between server and client are harmless.
      */}
      <div
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: content }}
      />
      <LeadMagnet slug={slug} articleId={articleId} />
    </div>
  );
}
