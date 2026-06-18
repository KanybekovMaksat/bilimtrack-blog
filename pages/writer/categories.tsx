import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NextLink from "next/link";
import { EditorNav } from "@/widgets/editor-nav";

const MOCK_CATEGORIES = [
  { id: "1", name: "Кейсы", slug: "cases", articles: 4, color: "#dcfce7", textColor: "#008236" },
  { id: "2", name: "Советы", slug: "advice", articles: 3, color: "#faf5ff", textColor: "#9333ea" },
  { id: "3", name: "Управление", slug: "manage", articles: 2, color: "#eff6ff", textColor: "#155dfc" },
  { id: "4", name: "Новости", slug: "news", articles: 1, color: "#fff7ed", textColor: "#ea580c" },
];

export default function WriterCategoriesPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("cms_token")) router.replace("/writer/login");
    else setIsAuth(true);
  }, [router]);

  if (!isAuth) return null;

  return (
    <>
      <Head>
        <title>Категории — Bilimtrack CMS</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="admin-body admin-body--full">
        <EditorNav />

        <main className="articles-page">
          <div className="articles-topbar">
            <div>
              <h1 className="articles-title">Категории</h1>
              <p className="articles-sub">Структурируйте контент блога</p>
            </div>
            <button className="btn btn--primary" onClick={() => setShowForm(true)}>
              + Новая категория
            </button>
          </div>

          {showForm && (
            <div className="cat-form-card">
              <h3>Новая категория</h3>
              <div className="cat-form-row">
                <input
                  className="field-input"
                  placeholder="Название категории..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
                <button className="btn btn--primary" onClick={() => { setShowForm(false); setNewName(""); }}>
                  Сохранить
                </button>
                <button className="btn btn--outline" onClick={() => setShowForm(false)}>
                  Отмена
                </button>
              </div>
            </div>
          )}

          <div className="cat-grid">
            {MOCK_CATEGORIES.map((cat) => (
              <div key={cat.id} className="cat-card">
                <div className="cat-card__header" style={{ background: cat.color }}>
                  <span className="cat-card__tag" style={{ color: cat.textColor }}>
                    {cat.name}
                  </span>
                </div>
                <div className="cat-card__body">
                  <div className="cat-card__name">{cat.name}</div>
                  <div className="cat-card__slug">/{cat.slug}</div>
                  <div className="cat-card__count">{cat.articles} статей</div>
                </div>
                <div className="cat-card__actions">
                  <button className="cat-action-btn">Редактировать</button>
                  <button className="cat-action-btn cat-action-btn--danger">Удалить</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
