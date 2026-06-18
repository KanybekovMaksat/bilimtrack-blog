import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EditorNav } from "@/widgets/editor-nav";
import { cmsApi, blogApi } from "@/shared/api/blog-api";

interface ArticleRow {
  id: string;
  titleRu?: string;
  title?: string;
  viewsCount?: number;
  views?: number;
  publishedAt?: string;
  createdAt?: string;
}

function getTitle(a: ArticleRow): string {
  return a.titleRu ?? a.title ?? "—";
}
function getViews(a: ArticleRow): number {
  return a.viewsCount ?? a.views ?? 0;
}

export default function WriterStatsPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");

  const [articles, setArticles] = useState<ArticleRow[]>([]);
  const [popular, setPopular] = useState<ArticleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("cms_token")) router.replace("/writer/login");
    else setIsAuth(true);
  }, [router]);

  useEffect(() => {
    if (!isAuth) return;
    setLoading(true);

    Promise.allSettled([
      cmsApi.getArticles(),
      blogApi.getPopular("ru"),
    ]).then(([cmsRes, popularRes]) => {
      if (cmsRes.status === "fulfilled") {
        const list: ArticleRow[] = cmsRes.value?.data ?? cmsRes.value ?? [];
        setArticles(Array.isArray(list) ? list : []);
      }
      if (popularRes.status === "fulfilled") {
        const list: ArticleRow[] = popularRes.value?.data ?? popularRes.value ?? [];
        setPopular(Array.isArray(list) ? list : []);
      }
    }).finally(() => setLoading(false));
  }, [isAuth]);

  if (!isAuth) return null;

  const published = articles.filter((a) => (a as any).status === "published");
  const drafts = articles.filter((a) => (a as any).status === "draft");
  const totalViews = articles.reduce((sum, a) => sum + getViews(a), 0);

  // Top articles sorted by views (from CMS full list)
  const topArticles = [...articles]
    .sort((a, b) => getViews(b) - getViews(a))
    .slice(0, 5);

  // Use popular from public API if available, fallback to CMS sorted by views
  const topList = popular.length > 0 ? popular.slice(0, 5) : topArticles;

  return (
    <>
      <Head>
        <title>Статистика — Bilimtrack CMS</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="admin-body admin-body--full">
        <EditorNav />

        <main className="articles-page">
          <div className="articles-topbar">
            <div>
              <h1 className="articles-title">Статистика</h1>
              <p className="articles-sub">Аналитика просмотров и публикаций</p>
            </div>
            <div className="stat-period-tabs">
              {(["7d", "30d", "90d"] as const).map((p) => (
                <button
                  key={p}
                  className={`art-tab${period === p ? " is-active" : ""}`}
                  onClick={() => setPeriod(p)}
                >
                  {{ "7d": "7 дней", "30d": "30 дней", "90d": "90 дней" }[p]}
                </button>
              ))}
            </div>
          </div>

          {/* KPI cards */}
          <div className="stat-kpis">
            <div className="stat-kpi">
              <span className="stat-kpi__icon">📄</span>
              <div>
                <div className="stat-kpi__num">
                  {loading ? "—" : articles.length.toLocaleString("ru-RU")}
                </div>
                <div className="stat-kpi__label">Всего статей</div>
              </div>
            </div>
            <div className="stat-kpi">
              <span className="stat-kpi__icon">✅</span>
              <div>
                <div className="stat-kpi__num">
                  {loading ? "—" : published.length.toLocaleString("ru-RU")}
                </div>
                <div className="stat-kpi__label">Опубликованных</div>
              </div>
            </div>
            <div className="stat-kpi">
              <span className="stat-kpi__icon">✏️</span>
              <div>
                <div className="stat-kpi__num">
                  {loading ? "—" : drafts.length.toLocaleString("ru-RU")}
                </div>
                <div className="stat-kpi__label">Черновиков</div>
              </div>
            </div>
            <div className="stat-kpi">
              <span className="stat-kpi__icon">👁️</span>
              <div>
                <div className="stat-kpi__num">
                  {loading ? "—" : totalViews.toLocaleString("ru-RU")}
                </div>
                <div className="stat-kpi__label">Суммарно просмотров</div>
              </div>
            </div>
          </div>

          {/* Top articles */}
          <div className="stat-card">
            <div className="stat-card__title">
              Топ статей по просмотрам
              {popular.length > 0 && (
                <span style={{ fontSize: 12, color: "var(--text-muted, #737373)", marginLeft: 8 }}>
                  (публичный API)
                </span>
              )}
            </div>

            {loading ? (
              <div style={{ padding: "24px 0", opacity: 0.5, textAlign: "center" }}>
                Загрузка...
              </div>
            ) : topList.length === 0 ? (
              <div className="art-empty">Нет данных</div>
            ) : (
              <table className="art-table">
                <thead>
                  <tr>
                    <th>Статья</th>
                    <th>Просмотры</th>
                  </tr>
                </thead>
                <tbody>
                  {topList.map((a, i) => (
                    <tr key={a.id ?? i}>
                      <td className="art-table__title">
                        <span className="stat-rank">#{i + 1}</span> {getTitle(a)}
                      </td>
                      <td className="art-table__num">
                        {getViews(a) > 0
                          ? getViews(a).toLocaleString("ru-RU")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
