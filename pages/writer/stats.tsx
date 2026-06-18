import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EditorNav } from "@/widgets/editor-nav";

// ─── Mock chart data ──────────────────────────────────────────────────────────
const WEEKLY_VIEWS = [
  { day: "Пн", views: 312 },
  { day: "Вт", views: 478 },
  { day: "Ср", views: 541 },
  { day: "Чт", views: 390 },
  { day: "Пт", views: 622 },
  { day: "Сб", views: 208 },
  { day: "Вс", views: 174 },
];

const TOP_ARTICLES = [
  { title: "Gamification в школе: опыт 15 организаций", views: 3021, growth: "+12%" },
  { title: "Как снизить бумажную нагрузку на учителей", views: 2341, growth: "+8%" },
  { title: "Как внедрить цифровое расписание за 3 дня", views: 1842, growth: "+5%" },
  { title: "Аналитика успеваемости: практическое руководство", views: 1105, growth: "+3%" },
  { title: "Электронный журнал: плюсы и подводные камни", views: 976, growth: "−2%" },
];

const TOTAL_VIEWS = 11_366;
const MAX_VIEWS = Math.max(...WEEKLY_VIEWS.map((d) => d.views));

export default function WriterStatsPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [period, setPeriod] = useState<"7d" | "30d" | "90d">("7d");

  useEffect(() => {
    if (!localStorage.getItem("cms_token")) router.replace("/writer/login");
    else setIsAuth(true);
  }, [router]);

  if (!isAuth) return null;

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
              <p className="articles-sub">Аналитика просмотров и вовлечённости</p>
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
              <span className="stat-kpi__icon">👁️</span>
              <div>
                <div className="stat-kpi__num">{TOTAL_VIEWS.toLocaleString("ru-RU")}</div>
                <div className="stat-kpi__label">Просмотров за период</div>
              </div>
              <span className="stat-kpi__badge stat-kpi__badge--up">+18%</span>
            </div>
            <div className="stat-kpi">
              <span className="stat-kpi__icon">⏱️</span>
              <div>
                <div className="stat-kpi__num">3:42</div>
                <div className="stat-kpi__label">Среднее время чтения</div>
              </div>
              <span className="stat-kpi__badge stat-kpi__badge--up">+7%</span>
            </div>
            <div className="stat-kpi">
              <span className="stat-kpi__icon">🔗</span>
              <div>
                <div className="stat-kpi__num">824</div>
                <div className="stat-kpi__label">Уникальных читателей</div>
              </div>
              <span className="stat-kpi__badge stat-kpi__badge--down">−3%</span>
            </div>
            <div className="stat-kpi">
              <span className="stat-kpi__icon">📣</span>
              <div>
                <div className="stat-kpi__num">47</div>
                <div className="stat-kpi__label">Подписок за период</div>
              </div>
              <span className="stat-kpi__badge stat-kpi__badge--up">+22%</span>
            </div>
          </div>

          {/* Bar chart */}
          <div className="stat-card">
            <div className="stat-card__title">Просмотры по дням (моковые данные)</div>
            <div className="stat-bar-chart">
              {WEEKLY_VIEWS.map((d) => (
                <div key={d.day} className="stat-bar-col">
                  <div className="stat-bar-val">{d.views}</div>
                  <div
                    className="stat-bar"
                    style={{ height: `${(d.views / MAX_VIEWS) * 140}px` }}
                  />
                  <div className="stat-bar-day">{d.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Top articles */}
          <div className="stat-card">
            <div className="stat-card__title">Топ статей по просмотрам</div>
            <table className="art-table">
              <thead>
                <tr>
                  <th>Статья</th>
                  <th>Просмотры</th>
                  <th>Изменение</th>
                </tr>
              </thead>
              <tbody>
                {TOP_ARTICLES.map((a, i) => (
                  <tr key={i}>
                    <td className="art-table__title">
                      <span className="stat-rank">#{i + 1}</span> {a.title}
                    </td>
                    <td className="art-table__num">{a.views.toLocaleString("ru-RU")}</td>
                    <td>
                      <span className={`stat-growth${a.growth.startsWith("+") ? " stat-growth--up" : " stat-growth--down"}`}>
                        {a.growth}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </>
  );
}
