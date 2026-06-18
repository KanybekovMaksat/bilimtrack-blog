import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { EditorNav } from "@/widgets/editor-nav";
import { cmsApi } from "@/shared/api/blog-api";

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_ARTICLES = [
  { id: "1", title: "Как внедрить цифровое расписание за 3 дня", status: "published", category: "Кейсы", views: 1842, date: "10 июн 2026" },
  { id: "2", title: "Электронный журнал: плюсы и подводные камни", status: "published", category: "Советы", views: 976, date: "05 июн 2026" },
  { id: "3", title: "Bilimtrack для колледжей — особенности внедрения", status: "draft", category: "Кейсы", views: 0, date: "02 июн 2026" },
  { id: "4", title: "Как снизить бумажную нагрузку на учителей", status: "published", category: "Управление", views: 2341, date: "28 май 2026" },
  { id: "5", title: "Аналитика успеваемости: практическое руководство", status: "published", category: "Советы", views: 1105, date: "20 май 2026" },
  { id: "6", title: "Интеграция с государственными сервисами НОБД", status: "draft", category: "Новости", views: 0, date: "18 май 2026" },
  { id: "7", title: "Мобильное приложение для родителей: онбординг", status: "published", category: "Советы", views: 654, date: "12 май 2026" },
  { id: "8", title: "Gamification в школе: опыт 15 организаций", status: "published", category: "Кейсы", views: 3021, date: "05 май 2026" },
  { id: "9", title: "Безопасность данных в образовательных платформах", status: "archived", category: "Новости", views: 430, date: "28 апр 2026" },
  { id: "10", title: "API Bilimtrack: руководство разработчика", status: "published", category: "Кейсы", views: 892, date: "20 апр 2026" },
];

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  published: { label: "Опубликована", cls: "art-badge art-badge--published" },
  draft:     { label: "Черновик",     cls: "art-badge art-badge--draft" },
  archived:  { label: "Архив",        cls: "art-badge art-badge--archived" },
};

export default function WriterArticlesPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "archived">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("cms_token")) router.replace("/writer/login");
    else setIsAuth(true);
  }, [router]);

  if (!isAuth) return null;

  const filtered = MOCK_ARTICLES.filter((a) => {
    const matchStatus = filter === "all" || a.status === filter;
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all:       MOCK_ARTICLES.length,
    published: MOCK_ARTICLES.filter((a) => a.status === "published").length,
    draft:     MOCK_ARTICLES.filter((a) => a.status === "draft").length,
    archived:  MOCK_ARTICLES.filter((a) => a.status === "archived").length,
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

          {/* Table */}
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
                {filtered.map((a) => (
                  <tr key={a.id}>
                    <td className="art-table__title">{a.title}</td>
                    <td><span className="art-cat">{a.category}</span></td>
                    <td>
                      <span className={STATUS_LABELS[a.status].cls}>
                        {STATUS_LABELS[a.status].label}
                      </span>
                    </td>
                    <td className="art-table__num">
                      {a.views > 0 ? a.views.toLocaleString("ru-RU") : "—"}
                    </td>
                    <td className="art-table__date">{a.date}</td>
                    <td>
                      <NextLink href="/writer/admin" className="art-edit-btn">
                        Редактировать
                      </NextLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="art-empty">Ничего не найдено</div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
