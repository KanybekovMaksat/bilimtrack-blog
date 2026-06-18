import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EditorNav } from "@/widgets/editor-nav";
import { cmsApi } from "@/shared/api/blog-api";

interface Author {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  articlesCount?: number;
  createdAt?: string;
  joined?: string;
}

const AVATAR_COLORS = ["#155dfc", "#00a63e", "#ad46ff", "#ea580c", "#0891b2", "#be123c"];

function getFullName(a: Author): string {
  if (a.name) return a.name;
  if (a.firstName || a.lastName) return `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim();
  return "—";
}

function getInitials(a: Author): string {
  const name = getFullName(a);
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function getJoined(a: Author): string {
  const raw = a.createdAt ?? a.joined;
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleDateString("ru-RU", { month: "short", year: "numeric" });
  } catch {
    return raw;
  }
}

export default function WriterAuthorsPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!localStorage.getItem("cms_token")) router.replace("/writer/login");
    else setIsAuth(true);
  }, [router]);

  useEffect(() => {
    if (!isAuth) return;
    setLoading(true);
    setError(null);
    cmsApi.getAuthors()
      .then((res) => {
        const list: Author[] = res?.data ?? res ?? [];
        setAuthors(Array.isArray(list) ? list : []);
      })
      .catch(() => setError("Не удалось загрузить авторов"))
      .finally(() => setLoading(false));
  }, [isAuth]);

  if (!isAuth) return null;

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить автора?")) return;
    setDeletingId(id);
    const token = localStorage.getItem("cms_token") ?? "";
    try {
      await cmsApi.deleteAuthor(token, id);
      setAuthors((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Ошибка при удалении");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Head>
        <title>Авторы — Bilimtrack CMS</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="admin-body admin-body--full">
        <EditorNav />

        <main className="articles-page">
          <div className="articles-topbar">
            <div>
              <h1 className="articles-title">Авторы</h1>
              <p className="articles-sub">Команда редакции блога</p>
            </div>
          </div>

          {loading && (
            <div className="art-empty" style={{ padding: "48px 0" }}>
              <span style={{ opacity: 0.5 }}>Загрузка авторов...</span>
            </div>
          )}
          {error && (
            <div className="art-empty" style={{ color: "var(--danger, #dc2626)", padding: "48px 0" }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <>
              {authors.length === 0 ? (
                <div className="art-empty">Авторы не найдены</div>
              ) : (
                <div className="authors-grid">
                  {authors.map((author, i) => (
                    <div key={author.id} className="author-card">
                      <div
                        className="author-card__avatar"
                        style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                      >
                        {getInitials(author)}
                      </div>
                      <div className="author-card__info">
                        <div className="author-card__name">{getFullName(author)}</div>
                        <div className="author-card__role">
                          {author.role ?? author.email ?? "Автор"}
                        </div>
                      </div>
                      <div className="author-card__stats">
                        <div className="author-stat">
                          <span className="author-stat__num">
                            {author.articlesCount ?? "—"}
                          </span>
                          <span className="author-stat__label">статей</span>
                        </div>
                        <div className="author-stat">
                          <span className="author-stat__num">{getJoined(author)}</span>
                          <span className="author-stat__label">с нами</span>
                        </div>
                      </div>
                      <div className="author-card__actions">
                        <button
                          className="cat-action-btn cat-action-btn--danger"
                          onClick={() => handleDelete(author.id)}
                          disabled={deletingId === author.id}
                        >
                          {deletingId === author.id ? "..." : "Удалить"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </>
  );
}
