import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { EditorNav } from "@/widgets/editor-nav";
import { cmsApi } from "@/shared/api/blog-api";

interface Article {
  id: string;
  titleRu?: string;
  title?: string;
  slug?: string;
  status: string;
  category?: { nameRu?: string; name?: string; slug?: string } | string;
  viewsCount?: number;
  views?: number;
  publishedAt?: string;
  createdAt?: string;
  created_at?: string;
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  published: { label: "Опубликована", cls: "art-badge art-badge--published" },
  draft:     { label: "Черновик",     cls: "art-badge art-badge--draft" },
  archived:  { label: "Архив",        cls: "art-badge art-badge--archived" },
};

function getTitle(a: Article): string {
  return a.titleRu ?? a.title ?? "—";
}

function getCategory(a: Article): string {
  if (!a.category) return "—";
  if (typeof a.category === "string") return a.category;
  return a.category.nameRu ?? a.category.name ?? a.category.slug ?? "—";
}

function getViews(a: Article): number {
  return a.viewsCount ?? a.views ?? 0;
}

function getDate(a: Article): string {
  const raw = a.publishedAt ?? a.createdAt ?? a.created_at;
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleDateString("ru-RU", {
      day: "numeric", month: "short", year: "numeric",
    });
  } catch {
    return raw;
  }
}

export default function WriterArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "archived">("all");
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    cmsApi.getArticles()
      .then((res) => {
        const list: Article[] = res?.data ?? res ?? [];
        setArticles(Array.isArray(list) ? list : []);
      })
      .catch(() => setError("Не удалось загрузить статьи"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter((a) => {
    const matchStatus = filter === "all" || a.status === filter;
    const matchSearch = getTitle(a).toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all:       articles.length,
    published: articles.filter((a) => a.status === "published").length,
    draft:     articles.filter((a) => a.status === "draft").length,
    archived:  articles.filter((a) => a.status === "archived").length,
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить статью?")) return;
    setDeletingId(id);
    const token = localStorage.getItem("cms_token") ?? "";
    try {
      await cmsApi.deleteArticle(token, id);
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Ошибка при удалении");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Head>
        <title>Статьи — Bilimtrack CMS</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="admin-body admin-body--full">
        <EditorNav />

        <main className="articles-page">
          <div className="articles-topbar">
            <div>
              <h1 className="articles-title">Статьи</h1>
              <p className="articles-sub">Управляйте публикациями блога</p>
            </div>
            <NextLink href="/writer/admin" className="btn btn--primary">
              + Новая статья
            </NextLink>
          </div>

          {/* Filters */}
          <div className="articles-filters">
            <div className="art-tabs">
              {(["all", "published", "draft", "archived"] as const).map((f) => (
                <button
                  key={f}
                  className={`art-tab${filter === f ? " is-active" : ""}`}
                  onClick={() => setFilter(f)}
                >
                  {{ all: "Все", published: "Опубликованы", draft: "Черновики", archived: "Архив" }[f]}
                  <span className="art-tab__count">{counts[f]}</span>
                </button>
              ))}
            </div>
            <input
              className="art-search"
              type="search"
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* States */}
          {loading && (
            <div className="art-empty" style={{ padding: "48px 0" }}>
              <span style={{ opacity: 0.5 }}>Загрузка статей...</span>
            </div>
          )}
          {error && (
            <div className="art-empty" style={{ color: "var(--danger, #dc2626)", padding: "48px 0" }}>
              {error}
            </div>
          )}

          {/* Table */}
          {!loading && !error && (
            <div className="art-table-wrap">
              <table className="art-table">
                <thead>
                  <tr>
                    <th>Название</th>
                    <th>Категория</th>
                    <th>Статус</th>
                    <th>Просмотры</th>
                    <th>Дата</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => {
                    const badge = STATUS_LABELS[a.status] ?? { label: a.status, cls: "art-badge" };
                    return (
                      <tr key={a.id}>
                        <td className="art-table__title">{getTitle(a)}</td>
                        <td><span className="art-cat">{getCategory(a)}</span></td>
                        <td>
                          <span className={badge.cls}>{badge.label}</span>
                        </td>
                        <td className="art-table__num">
                          {getViews(a) > 0 ? getViews(a).toLocaleString("ru-RU") : "—"}
                        </td>
                        <td className="art-table__date">{getDate(a)}</td>
                        <td style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                          <NextLink
                            href={`/writer/admin?id=${a.id}`}
                            className="art-edit-btn"
                          >
                            Редактировать
                          </NextLink>
                          {a.status === "published" && a.slug && (
                            <NextLink
                              href={`/blog/${a.slug}`}
                              target="_blank"
                              className="art-edit-btn"
                              style={{ color: "var(--primary, #3b82f6)", borderColor: "var(--primary, #3b82f6)" }}
                            >
                              Смотреть ↗
                            </NextLink>
                          )}
                          <button
                            className="art-edit-btn"
                            style={{ color: "var(--danger, #dc2626)", borderColor: "var(--danger, #dc2626)" }}
                            onClick={() => handleDelete(a.id)}
                            disabled={deletingId === a.id}
                          >
                            {deletingId === a.id ? "..." : "Удалить"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="art-empty">Ничего не найдено</div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
